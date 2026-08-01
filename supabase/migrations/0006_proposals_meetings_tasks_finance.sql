-- Fluxo CRM — propostas, reuniões, tarefas e financeiro

create table proposal_code_counters (
  year int primary key,
  last_value int not null default 0
);
comment on table proposal_code_counters is 'Contador por ano para o código PROP-AAAA-NNN (ver função next_proposal_code em 0009).';

create table proposals (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  lead_id uuid references leads(id) on delete set null,
  client_id uuid references clients(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  title text not null,
  value numeric(12, 2) not null,
  status proposal_status_enum not null default 'draft',
  sent_at timestamptz,
  valid_until date,
  payment_terms text,
  payment_method text,
  notes text,
  rejected_reason_id uuid references loss_reasons(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table projects
  add constraint projects_proposal_id_fkey
  foreign key (proposal_id) references proposals(id);

create table meetings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  lead_id uuid references leads(id) on delete cascade,
  client_id uuid references clients(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  type meeting_type_enum not null default 'meeting',
  starts_at timestamptz not null,
  ends_at timestamptz,
  format meeting_format_enum,
  location text,
  link text,
  objective text,
  notes text,
  status meeting_status_enum not null default 'scheduled',
  reminder_minutes int,
  external_id text,
  external_source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint meetings_at_most_one_owner check (num_nonnulls(lead_id, client_id, project_id) <= 1)
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  lead_id uuid references leads(id) on delete cascade,
  client_id uuid references clients(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  priority task_priority_enum not null default 'medium',
  due_at timestamptz,
  status task_status_enum not null default 'pending',
  done_at timestamptz,
  assignee_id uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table financial_transactions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  proposal_id uuid references proposals(id) on delete set null,
  description text not null,
  amount numeric(12, 2) not null,
  kind transaction_kind_enum not null,
  expense_category expense_category_enum,
  status transaction_status_enum not null default 'pending',
  due_date date,
  paid_at timestamptz,
  method payment_method_enum,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
