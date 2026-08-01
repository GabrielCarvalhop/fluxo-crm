-- Fluxo CRM — views agregadas e busca global
-- Nenhuma dessas views expõe uma coluna "url": a rota é um detalhe da
-- aplicação Next.js, não do banco. lib/queries mapeia type+id para o href.

create view v_agenda_events as
select id, 'meeting'::text as source, title, starts_at, ends_at, status::text, lead_id, client_id, project_id
from meetings

union all

select id, 'follow_up'::text, title, due_at as starts_at, null::timestamptz as ends_at, status::text, lead_id, client_id, null::uuid as project_id
from follow_ups
where status = 'pending'

union all

select id, 'task'::text, title, due_at as starts_at, null::timestamptz as ends_at, status::text, lead_id, client_id, project_id
from tasks
where due_at is not null and status <> 'done'

union all

select id, 'project_deadline'::text, name || ' — prazo', due_date::timestamptz as starts_at, null::timestamptz as ends_at, status::text, null::uuid as lead_id, client_id, id as project_id
from projects
where due_date is not null and deleted_at is null and status not in ('finished', 'post_sale');

comment on view v_agenda_events is 'Fonte única da agenda — reuniões, follow-ups pendentes, tarefas com prazo e prazos de projeto, num só formato.';

create view v_project_progress as
select
  p.id as project_id,
  coalesce(i.total_items, 0) as total_items,
  coalesce(i.done_items, 0) as done_items,
  case when coalesce(i.total_items, 0) = 0 then 0
       else round(100.0 * i.done_items / i.total_items, 1)
  end as progress_pct,
  coalesce(e.total_expenses, 0) as total_expenses,
  coalesce(p.value, 0) - coalesce(e.total_expenses, 0) as profit_estimate
from projects p
left join (
  select g.project_id, count(it.id) as total_items, count(it.id) filter (where it.done) as done_items
  from project_checklist_groups g
  join project_checklist_items it on it.group_id = g.id
  group by g.project_id
) i on i.project_id = p.id
left join (
  select project_id, sum(amount) as total_expenses
  from financial_transactions
  where kind = 'expense' and deleted_at is null
  group by project_id
) e on e.project_id = p.id
where p.deleted_at is null;

create view v_financial_status as
select
  ft.*,
  case
    when ft.status = 'pending' and ft.due_date is not null and ft.due_date < current_date then 'overdue'
    else ft.status::text
  end as effective_status
from financial_transactions ft
where ft.deleted_at is null;
comment on view v_financial_status is 'overdue nunca é armazenado — é sempre pending + due_date vencida, calculado aqui.';

create view v_proposals as
select
  pr.*,
  case
    when pr.status in ('sent', 'viewed', 'negotiation')
      and pr.valid_until is not null and pr.valid_until < current_date
    then 'expired'
    else pr.status::text
  end as effective_status
from proposals pr
where pr.deleted_at is null;
comment on view v_proposals is 'expired nunca é digitado — é sempre sent/viewed/negotiation + validade vencida, calculado aqui.';

create view v_funnel_metrics as
select
  count(*) as prospected_count,
  count(*) filter (
    where ps.position >= (select position from pipeline_stages where key = 'responded')
  ) as responded_count,
  count(*) filter (
    where exists (select 1 from meetings m where m.lead_id = l.id and m.status = 'done')
  ) as meeting_count,
  count(*) filter (
    where exists (select 1 from proposals p where p.lead_id = l.id and p.deleted_at is null)
  ) as proposal_count,
  count(*) filter (where ps.is_won) as won_count
from leads l
join pipeline_stages ps on ps.id = l.stage_id
where l.deleted_at is null;
comment on view v_funnel_metrics is 'Aproximação por estágio atual (posição >= "respondeu"), não por histórico completo — suficiente para o resumo do dashboard. O relatório de funil em /reports pode refinar com activity_logs se precisar de recorte por período.';

create or replace function global_search(q text)
returns table (type text, id uuid, title text, subtitle text)
language sql
stable
security invoker
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
comment on function global_search is 'security invoker: roda com as policies de RLS de quem chamou, nunca vaza dados de outro usuário quando a equipe crescer.';
