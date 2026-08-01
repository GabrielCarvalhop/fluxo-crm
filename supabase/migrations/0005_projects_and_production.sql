-- Fluxo CRM — projetos e workflow de produção
-- projects.proposal_id referencia proposals, que só existe em 0006 —
-- coluna criada aqui sem FK, fechada por ALTER TABLE em 0006.

create table projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  proposal_id uuid,
  name text not null,
  type project_type_enum not null default 'other',
  status project_status_enum not null default 'briefing_pending',
  briefing_status briefing_status_enum not null default 'not_sent',
  start_date date,
  due_date date,
  delivered_at timestamptz,
  value numeric(12, 2),
  final_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table notes
  add constraint notes_project_id_fkey
  foreign key (project_id) references projects(id) on delete cascade;

create table project_checklist_groups (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  label text not null,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table project_checklist_items (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references project_checklist_groups(id) on delete cascade,
  label text not null,
  position int not null default 0,
  done boolean not null default false,
  done_at timestamptz,
  done_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table project_briefings (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references projects(id) on delete cascade,
  about text,
  services text,
  target_audience text,
  differentiators text,
  goal text,
  whatsapp text,
  instagram text,
  location text,
  competitors text,
  references_text text,
  colors text,
  logo_notes text,
  photos_notes text,
  domain_notes text,
  answered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table domains (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  domain_name text not null,
  registrar text,
  registered_at date,
  expires_at date,
  cost numeric(12, 2),
  paid_by paid_by_enum,
  hosting hosting_enum,
  hosting_notes text,
  dns_configured boolean not null default false,
  final_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
