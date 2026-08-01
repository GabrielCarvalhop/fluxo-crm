-- Reordenar leads no Kanban.
-- Antes o app calculava uma posição fracionária entre os vizinhos, mas como
-- todos os leads nasciam com position=0, a média entre 0 e 0 dava 0 e o
-- reordenamento dentro da própria coluna não grudava. Aqui a coluna inteira
-- é renumerada de uma vez, num único round-trip e de forma atômica.
create or replace function reorder_leads(p_lead_ids uuid[], p_stage_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  update leads l
  set stage_id = p_stage_id,
      position = idx.ord
  from unnest(p_lead_ids) with ordinality as idx(lead_id, ord)
  where l.id = idx.lead_id;
end;
$$;

revoke execute on function public.reorder_leads(uuid[], uuid) from anon;
