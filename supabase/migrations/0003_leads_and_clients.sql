-- Fluxo CRM — leads e clientes
-- leads.converted_client_id e clients.lead_id se referenciam mutuamente
-- (anti-duplicação na conversão). Criamos leads primeiro sem a FK de volta,
-- criamos clients, e fechamos o par com ALTER TABLE no final do arquivo.

create table leads (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text,
  segment_id uuid references segments(id),
  city text,
  state text,
  whatsapp text,
  phone text,
  email text,
  instagram text,
  website_url text,
  google_maps_url text,
  source_id uuid references lead_sources(id),
  has_website boolean,
  website_quality website_quality_enum,
  pilot_created boolean not null default false,
  pilot_url text,
  stage_id uuid not null references pipeline_stages(id),
  position numeric not null default 0,
  temperature lead_temperature_enum not null default 'none',
  lead_score int not null default 0,
  estimated_value numeric(12, 2),
  prospected_at timestamptz not null default now(),
  last_contact_at timestamptz,
  next_follow_up_at timestamptz,
  next_action text,
  stage_changed_at timestamptz not null default now(),
  owner_id uuid references profiles(id),
  notes text,
  loss_reason_id uuid references loss_reasons(id),
  loss_notes text,
  converted_client_id uuid,
  converted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
comment on table leads is 'next_follow_up_at/next_action são espelho do follow-up pendente mais próximo (mantidos por trigger) — a fonte de verdade é follow_ups.';

create table clients (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id),
  company_name text not null,
  contact_name text,
  whatsapp text,
  email text,
  instagram text,
  city text,
  state text,
  document text,
  website_url text,
  domain text,
  status client_status_enum not null default 'active',
  last_contact_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
comment on table clients is 'lead_id guarda a origem (evita redigitar dados na conversão). Nem todo cliente precisa ter vindo de um lead rastreado.';

alter table leads
  add constraint leads_converted_client_id_fkey
  foreign key (converted_client_id) references clients(id);
