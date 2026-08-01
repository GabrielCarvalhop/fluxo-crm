-- Fluxo CRM — RLS
-- Política MVP: usuário autenticado com profiles.active = true tem acesso
-- total. owner_id/assignee_id já existem nas tabelas de domínio para, quando
-- a equipe crescer, trocar esta policy por uma mais estreita sem migration
-- de schema — só troca de policy.

create or replace function public.is_active_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and active = true
  );
$$;
comment on function public.is_active_user is 'security definer: consulta profiles ignorando a própria RLS de profiles, evitando recursão na policy.';

do $$
declare
  t text;
begin
  for t in
    select tablename from pg_tables
    where schemaname = 'public'
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists authenticated_full_access on %I', t);
    execute format(
      'create policy authenticated_full_access on %I for all to authenticated using (public.is_active_user()) with check (public.is_active_user())',
      t
    );
  end loop;
end $$;
