-- Fluxo CRM — correções apontadas pelos advisors do Supabase
--
-- 1) Views no Postgres rodam com o privilégio do DONO por padrão (não de
--    quem consulta) — como o dono é postgres, que bypassa RLS por ser
--    owner das tabelas, as 5 views vazariam TODAS as linhas para qualquer
--    usuário autenticado, ignorando a RLS. security_invoker fecha isso.
-- 2) Funções sem search_path fixo são vulneráveis a search_path hijacking.
-- 3) pg_trgm estava no schema public; movida para um schema dedicado.
-- 4) is_active_user()/handle_new_user() eram chamáveis via RPC por anon.

alter view v_agenda_events set (security_invoker = true);
alter view v_project_progress set (security_invoker = true);
alter view v_financial_status set (security_invoker = true);
alter view v_proposals set (security_invoker = true);
alter view v_funnel_metrics set (security_invoker = true);

create schema if not exists extensions;
alter extension pg_trgm set schema extensions;

revoke execute on function public.is_active_user() from public, anon;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

create or replace function set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function trg_leads_stage_changed_at_fn()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.stage_id is distinct from old.stage_id then
    new.stage_changed_at = now();
  end if;
  return new;
end;
$$;

create or replace function log_activity(
  p_actor_id uuid,
  p_entity_type text,
  p_entity_id uuid,
  p_action text,
  p_from_value text default null,
  p_to_value text default null,
  p_metadata jsonb default '{}'
) returns void language sql set search_path = public as $$
  insert into activity_logs (actor_id, entity_type, entity_id, action, from_value, to_value, metadata)
  values (p_actor_id, p_entity_type, p_entity_id, p_action, p_from_value, p_to_value, p_metadata);
$$;

create or replace function trg_leads_activity_fn()
returns trigger language plpgsql set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    perform log_activity(auth.uid(), 'lead', new.id, 'created', null, new.company_name);
  elsif tg_op = 'UPDATE' then
    if new.stage_id is distinct from old.stage_id then
      perform log_activity(
        auth.uid(), 'lead', new.id, 'stage_changed',
        (select label from pipeline_stages where id = old.stage_id),
        (select label from pipeline_stages where id = new.stage_id)
      );
    end if;
    if new.temperature is distinct from old.temperature then
      perform log_activity(auth.uid(), 'lead', new.id, 'temperature_changed', old.temperature::text, new.temperature::text);
    end if;
  end if;
  return new;
end;
$$;

create or replace function trg_clients_activity_fn()
returns trigger language plpgsql set search_path = public as $$
begin
  perform log_activity(auth.uid(), 'client', new.id, 'created', null, new.company_name);
  return new;
end;
$$;

create or replace function trg_proposals_activity_fn()
returns trigger language plpgsql set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    perform log_activity(auth.uid(), 'proposal', new.id, 'created', null, new.title);
  elsif tg_op = 'UPDATE' and new.status is distinct from old.status then
    perform log_activity(auth.uid(), 'proposal', new.id, 'status_changed', old.status::text, new.status::text);
  end if;
  return new;
end;
$$;

create or replace function trg_projects_activity_fn()
returns trigger language plpgsql set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    perform log_activity(auth.uid(), 'project', new.id, 'created', null, new.name);
  elsif tg_op = 'UPDATE' and new.status is distinct from old.status then
    perform log_activity(auth.uid(), 'project', new.id, 'status_changed', old.status::text, new.status::text);
  end if;
  return new;
end;
$$;

create or replace function trg_projects_delivered_at_fn()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.status = 'finished' and old.status is distinct from 'finished' and new.delivered_at is null then
    new.delivered_at = now();
  end if;
  return new;
end;
$$;

create or replace function trg_financial_paid_at_fn()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.status = 'paid' and old.status is distinct from 'paid' and new.paid_at is null then
    new.paid_at = now();
  end if;
  return new;
end;
$$;

create or replace function trg_financial_activity_fn()
returns trigger language plpgsql set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    perform log_activity(auth.uid(), 'financial_transaction', new.id, 'created', null, new.description);
  elsif tg_op = 'UPDATE' and new.status is distinct from old.status then
    perform log_activity(auth.uid(), 'financial_transaction', new.id, 'status_changed', old.status::text, new.status::text);
  end if;
  return new;
end;
$$;

create or replace function trg_lead_contacts_after_insert_fn()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.lead_id is not null then
    update leads set last_contact_at = new.contacted_at where id = new.lead_id;
  end if;
  if new.client_id is not null then
    update clients set last_contact_at = new.contacted_at where id = new.client_id;
  end if;

  if new.next_action_at is not null then
    insert into follow_ups (lead_id, client_id, title, due_at, source_contact_id, owner_id)
    values (new.lead_id, new.client_id, coalesce(new.next_action, 'Follow-up'), new.next_action_at, new.id, new.user_id);
  end if;

  perform log_activity(
    auth.uid(),
    case when new.lead_id is not null then 'lead' else 'client' end,
    coalesce(new.lead_id, new.client_id),
    'contact_logged',
    null,
    new.type::text
  );

  return new;
end;
$$;

create or replace function sync_lead_next_follow_up(p_lead_id uuid)
returns void language plpgsql set search_path = public as $$
declare
  v_due timestamptz;
  v_title text;
begin
  if p_lead_id is null then
    return;
  end if;

  select due_at, title into v_due, v_title
  from follow_ups
  where lead_id = p_lead_id and status = 'pending'
  order by due_at asc
  limit 1;

  update leads
  set next_follow_up_at = v_due, next_action = v_title
  where id = p_lead_id
    and (next_follow_up_at is distinct from v_due or next_action is distinct from v_title);
end;
$$;

create or replace function trg_follow_ups_sync_fn()
returns trigger language plpgsql set search_path = public as $$
begin
  if tg_op = 'DELETE' then
    perform sync_lead_next_follow_up(old.lead_id);
    return old;
  end if;

  perform sync_lead_next_follow_up(new.lead_id);
  if tg_op = 'UPDATE' and old.lead_id is distinct from new.lead_id then
    perform sync_lead_next_follow_up(old.lead_id);
  end if;
  return new;
end;
$$;

create or replace function next_proposal_code()
returns text language plpgsql set search_path = public as $$
declare
  v_year int := extract(year from now())::int;
  v_seq int;
begin
  insert into proposal_code_counters (year, last_value)
  values (v_year, 1)
  on conflict (year) do update set last_value = proposal_code_counters.last_value + 1
  returning last_value into v_seq;

  return 'PROP-' || v_year::text || '-' || lpad(v_seq::text, 3, '0');
end;
$$;

create or replace function trg_proposals_code_fn()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.code is null then
    new.code = next_proposal_code();
  end if;
  return new;
end;
$$;

create or replace function global_search(q text)
returns table (type text, id uuid, title text, subtitle text)
language sql
stable
security invoker
set search_path = public
as $$
  select 'lead', l.id, l.company_name, coalesce(l.city, '')
  from leads l
  where l.deleted_at is null and l.company_name ilike '%' || q || '%'

  union all

  select 'client', c.id, c.company_name, coalesce(c.city, '')
  from clients c
  where c.deleted_at is null and c.company_name ilike '%' || q || '%'

  union all

  select 'project', p.id, p.name, cl.company_name
  from projects p
  join clients cl on cl.id = p.client_id
  where p.deleted_at is null and p.name ilike '%' || q || '%'

  union all

  select 'proposal', pr.id, pr.title, pr.code
  from proposals pr
  where pr.deleted_at is null and pr.title ilike '%' || q || '%'

  union all

  select 'task', t.id, t.title, t.status::text
  from tasks t
  where t.title ilike '%' || q || '%'

  limit 30;
$$;

-- FKs sem índice apontadas pelo advisor de performance
create index idx_activity_logs_actor on activity_logs (actor_id);
create index idx_checklist_template_items_template on checklist_template_items (template_id);
create index idx_files_uploaded_by on files (uploaded_by);
create index idx_follow_ups_owner on follow_ups (owner_id);
create index idx_follow_ups_source_contact on follow_ups (source_contact_id);
create index idx_lead_contacts_user on lead_contacts (user_id);
create index idx_leads_loss_reason on leads (loss_reason_id);
create index idx_notes_author on notes (author_id);
create index idx_checklist_items_done_by on project_checklist_items (done_by);
create index idx_proposals_rejected_reason on proposals (rejected_reason_id);
