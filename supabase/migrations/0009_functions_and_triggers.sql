-- Fluxo CRM — funções e triggers
-- Regras de negócio automáticas vivem aqui, não na aplicação, para que
-- qualquer origem futura de escrita (API, automação, migração de dados)
-- gere o mesmo histórico e mantenha os mesmos invariantes.

-- 1) updated_at genérico, aplicado em toda tabela que tenha a coluna
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  for t in
    select table_name from information_schema.columns
    where table_schema = 'public' and column_name = 'updated_at'
  loop
    execute format('drop trigger if exists trg_set_updated_at on %I', t);
    execute format(
      'create trigger trg_set_updated_at before update on %I for each row execute function set_updated_at()',
      t
    );
  end loop;
end $$;

-- 2) bootstrap de profiles a partir do Supabase Auth (signup desabilitado —
-- o admin é criado pelo dashboard/API, este trigger só espelha em public.profiles)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, active)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', new.email), true)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3) stage_changed_at some junto com a mudança de estágio
create or replace function trg_leads_stage_changed_at_fn()
returns trigger language plpgsql as $$
begin
  if new.stage_id is distinct from old.stage_id then
    new.stage_changed_at = now();
  end if;
  return new;
end;
$$;

create trigger trg_leads_stage_changed_at
  before update on leads
  for each row execute function trg_leads_stage_changed_at_fn();

-- 4) helper de log + gatilhos por entidade
create or replace function log_activity(
  p_actor_id uuid,
  p_entity_type text,
  p_entity_id uuid,
  p_action text,
  p_from_value text default null,
  p_to_value text default null,
  p_metadata jsonb default '{}'
) returns void language sql as $$
  insert into activity_logs (actor_id, entity_type, entity_id, action, from_value, to_value, metadata)
  values (p_actor_id, p_entity_type, p_entity_id, p_action, p_from_value, p_to_value, p_metadata);
$$;

create or replace function trg_leads_activity_fn()
returns trigger language plpgsql as $$
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

create trigger trg_leads_activity
  after insert or update on leads
  for each row execute function trg_leads_activity_fn();

create or replace function trg_clients_activity_fn()
returns trigger language plpgsql as $$
begin
  perform log_activity(auth.uid(), 'client', new.id, 'created', null, new.company_name);
  return new;
end;
$$;

create trigger trg_clients_activity
  after insert on clients
  for each row execute function trg_clients_activity_fn();

create or replace function trg_proposals_activity_fn()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    perform log_activity(auth.uid(), 'proposal', new.id, 'created', null, new.title);
  elsif tg_op = 'UPDATE' and new.status is distinct from old.status then
    perform log_activity(auth.uid(), 'proposal', new.id, 'status_changed', old.status::text, new.status::text);
  end if;
  return new;
end;
$$;

create trigger trg_proposals_activity
  after insert or update on proposals
  for each row execute function trg_proposals_activity_fn();

create or replace function trg_projects_activity_fn()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    perform log_activity(auth.uid(), 'project', new.id, 'created', null, new.name);
  elsif tg_op = 'UPDATE' and new.status is distinct from old.status then
    perform log_activity(auth.uid(), 'project', new.id, 'status_changed', old.status::text, new.status::text);
  end if;
  return new;
end;
$$;

create trigger trg_projects_activity
  after insert or update on projects
  for each row execute function trg_projects_activity_fn();

create or replace function trg_projects_delivered_at_fn()
returns trigger language plpgsql as $$
begin
  if new.status = 'finished' and old.status is distinct from 'finished' and new.delivered_at is null then
    new.delivered_at = now();
  end if;
  return new;
end;
$$;

create trigger trg_projects_delivered_at
  before update on projects
  for each row execute function trg_projects_delivered_at_fn();

create or replace function trg_financial_paid_at_fn()
returns trigger language plpgsql as $$
begin
  if new.status = 'paid' and old.status is distinct from 'paid' and new.paid_at is null then
    new.paid_at = now();
  end if;
  return new;
end;
$$;

create trigger trg_financial_paid_at
  before update on financial_transactions
  for each row execute function trg_financial_paid_at_fn();

create or replace function trg_financial_activity_fn()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    perform log_activity(auth.uid(), 'financial_transaction', new.id, 'created', null, new.description);
  elsif tg_op = 'UPDATE' and new.status is distinct from old.status then
    perform log_activity(auth.uid(), 'financial_transaction', new.id, 'status_changed', old.status::text, new.status::text);
  end if;
  return new;
end;
$$;

create trigger trg_financial_activity
  after insert or update on financial_transactions
  for each row execute function trg_financial_activity_fn();

-- 5) registrar contato: atualiza last_contact_at, cria o próximo follow-up
-- e loga — é o formulário mais usado do sistema, então a consequência
-- inteira acontece num INSERT só.
create or replace function trg_lead_contacts_after_insert_fn()
returns trigger language plpgsql as $$
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

create trigger trg_lead_contacts_after_insert
  after insert on lead_contacts
  for each row execute function trg_lead_contacts_after_insert_fn();

-- 6) follow_ups é a fonte única de verdade; leads.next_follow_up_at/next_action
-- são só um espelho do pendente mais próximo, mantido aqui.
create or replace function sync_lead_next_follow_up(p_lead_id uuid)
returns void language plpgsql as $$
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
returns trigger language plpgsql as $$
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

create trigger trg_follow_ups_sync
  after insert or update or delete on follow_ups
  for each row execute function trg_follow_ups_sync_fn();

-- 7) código sequencial da proposta (PROP-2026-001), atômico por ano
create or replace function next_proposal_code()
returns text language plpgsql as $$
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
returns trigger language plpgsql as $$
begin
  if new.code is null then
    new.code = next_proposal_code();
  end if;
  return new;
end;
$$;

create trigger trg_proposals_code
  before insert on proposals
  for each row execute function trg_proposals_code_fn();
