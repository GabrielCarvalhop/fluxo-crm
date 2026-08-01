-- Fluxo CRM — histórico automático e arquivos
-- Únicas duas tabelas realmente polimórficas (entity_type/entity_id sem FK):
-- servem qualquer entidade e não precisam de integridade referencial forte,
-- só de um rastro auditável.

create table activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id),
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  from_value text,
  to_value text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
comment on table activity_logs is 'Alimentada por triggers no Postgres (0009), não pela aplicação — qualquer origem de escrita futura (API, automação) já gera histórico.';

create table files (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  storage_path text not null,
  filename text not null,
  mime text,
  size bigint,
  uploaded_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
