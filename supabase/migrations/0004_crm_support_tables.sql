-- Fluxo CRM — registro de contato, notas, tags, follow-ups
-- Polimorfismo controlado: colunas nullable dedicadas + CHECK, nunca
-- entity_type/entity_id genérico (preserva integridade referencial real).

create table lead_contacts (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  client_id uuid references clients(id) on delete cascade,
  user_id uuid references profiles(id),
  type contact_type_enum not null,
  contacted_at timestamptz not null default now(),
  summary text,
  outcome text,
  next_action text,
  next_action_at timestamptz,
  external_id text,
  external_source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lead_contacts_exactly_one_owner check (num_nonnulls(lead_id, client_id) = 1)
);

create table notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  client_id uuid references clients(id) on delete cascade,
  project_id uuid, -- FK para projects adicionada em 0005 (projects ainda não existe aqui)
  author_id uuid references profiles(id),
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint notes_exactly_one_owner check (num_nonnulls(lead_id, client_id, project_id) = 1)
);

create table lead_tags (
  lead_id uuid not null references leads(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (lead_id, tag_id)
);

create table client_tags (
  client_id uuid not null references clients(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (client_id, tag_id)
);

create table follow_ups (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  client_id uuid references clients(id) on delete cascade,
  title text not null,
  due_at timestamptz not null,
  status follow_up_status_enum not null default 'pending',
  done_at timestamptz,
  snoozed_from timestamptz,
  source_contact_id uuid references lead_contacts(id),
  owner_id uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint follow_ups_exactly_one_owner check (num_nonnulls(lead_id, client_id) = 1)
);
