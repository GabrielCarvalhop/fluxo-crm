-- Fluxo CRM — tabelas de configuração (editáveis em /settings)

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  role text not null default 'admin' check (role in ('admin', 'member')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table profiles is 'Um perfil por usuário Supabase Auth. Hoje só o admin; owner_id/assignee_id em outras tabelas já preparam para equipe.';

create table pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  color text not null,
  position int not null,
  is_won boolean not null default false,
  is_lost boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table pipeline_stages is 'Colunas do Kanban. Tabela, não enum, para permitir reordenar/desativar sem migration.';

create table lead_sources (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  position int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table segments (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  position int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table tags (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table loss_reasons (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  position int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table checklist_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  project_type project_type_enum,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table checklist_template_items (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references checklist_templates(id) on delete cascade,
  group_label text not null,
  label text not null,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table message_templates (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  body text not null,
  position int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table message_templates is 'Templates de WhatsApp com variáveis {{empresa}}, {{nome}}, etc. Copiar com um clique — sem integração de API no MVP.';

create table integrations_config (
  id uuid primary key default gen_random_uuid(),
  provider text not null unique,
  config jsonb not null default '{}',
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table integrations_config is 'Vazia no MVP. Espaço reservado para WhatsApp API, Google Calendar, Gmail, etc.';

-- Seed de configuração (não é o seed fictício de negócio — são as opções que
-- o sistema precisa para existir desde o primeiro boot)

insert into pipeline_stages (key, label, color, position, is_won, is_lost) values
  ('prospected', 'Prospectado', '#71717a', 1, false, false),
  ('to_contact', 'Contato a fazer', '#71717a', 2, false, false),
  ('contacted', 'Contato realizado', '#3b82f6', 3, false, false),
  ('responded', 'Respondeu', '#3b82f6', 4, false, false),
  ('qualifying', 'Qualificação', '#eab308', 5, false, false),
  ('meeting_scheduled', 'Reunião agendada', '#eab308', 6, false, false),
  ('proposal_sent', 'Proposta enviada', '#f97316', 7, false, false),
  ('negotiation', 'Negociação', '#f97316', 8, false, false),
  ('won', 'Fechado', '#10b981', 9, true, false),
  ('lost', 'Perdido', '#71717a', 10, false, true);

insert into lead_sources (key, label, position) values
  ('instagram_prospecting', 'Prospecção Instagram', 1),
  ('google_maps', 'Google Maps', 2),
  ('referral', 'Indicação', 3),
  ('whatsapp', 'WhatsApp', 4),
  ('instagram', 'Instagram', 5),
  ('linkedin', 'LinkedIn', 6),
  ('networking', 'Networking', 7),
  ('past_client', 'Cliente antigo', 8),
  ('website', 'Site', 9),
  ('other', 'Outro', 10);

insert into segments (key, label, position) values
  ('lawyer', 'Advogado', 1),
  ('inn', 'Pousada', 2),
  ('restaurant', 'Restaurante', 3),
  ('store', 'Loja', 4),
  ('tattoo_studio', 'Estúdio de tatuagem', 5),
  ('clinic', 'Clínica', 6),
  ('service_provider', 'Prestador de serviços', 7),
  ('local_business', 'Negócio local', 8),
  ('other', 'Outro', 9);

insert into loss_reasons (key, label, position) values
  ('price', 'Preço', 1),
  ('no_response', 'Não respondeu', 2),
  ('no_interest', 'Sem interesse', 3),
  ('has_provider', 'Já possui fornecedor', 4),
  ('postponed', 'Adiou projeto', 5),
  ('no_budget', 'Sem orçamento', 6),
  ('competitor', 'Concorrente', 7),
  ('other', 'Outro', 8);

insert into message_templates (key, title, body, position) values
  ('first_contact', 'Primeiro contato', 'Olá, {{nome}}! Tudo bem? Aqui é o Gabriel, da Fluxo Desenvolvimento. Vi o {{empresa}} e preparei um site piloto para mostrar como ficaria a presença online de vocês — posso te enviar o link?', 1),
  ('follow_up_1', 'Follow-up 1', 'Oi, {{nome}}! Passando para saber se conseguiu dar uma olhada no site piloto que te enviei. Fico à disposição para qualquer dúvida.', 2),
  ('follow_up_2', 'Follow-up 2', 'Oi, {{nome}}, tudo bem? Ainda tenho interesse em ajudar o {{empresa}} com o site. Faz sentido conversarmos essa semana?', 3),
  ('meeting', 'Reunião', 'Perfeito, {{nome}}! Ficou marcado para {{data}} às {{hora}}. Qualquer imprevisto me avisa por aqui.', 4),
  ('proposal_sent', 'Envio de proposta', 'Oi, {{nome}}! Segue a proposta para o site do {{empresa}}, conforme conversamos. Qualquer dúvida, é só chamar por aqui.', 5),
  ('post_meeting', 'Pós-reunião', 'Foi ótimo conversar com você hoje, {{nome}}! Qualquer dúvida que surgir sobre o que conversamos, me chama.', 6),
  ('delivery', 'Entrega', 'Oi, {{nome}}! Seu site já está no ar: {{url}}. Qualquer ajuste, é só me chamar por aqui.', 7);

insert into checklist_templates (name, project_type, is_default) values
  ('Padrão — Site institucional', 'institutional', true);

insert into checklist_template_items (template_id, group_label, label, position)
select t.id, i.group_label, i.label, i.position
from checklist_templates t
cross join (values
  ('Pré-produção', 'Briefing recebido', 1),
  ('Pré-produção', 'Logo recebida', 2),
  ('Pré-produção', 'Fotos recebidas', 3),
  ('Pré-produção', 'WhatsApp confirmado', 4),
  ('Pré-produção', 'Endereço confirmado', 5),
  ('Pré-produção', 'Serviços confirmados', 6),
  ('Desenvolvimento', 'Estrutura', 7),
  ('Desenvolvimento', 'Copy', 8),
  ('Desenvolvimento', 'Design', 9),
  ('Desenvolvimento', 'Responsividade', 10),
  ('Desenvolvimento', 'WhatsApp', 11),
  ('Desenvolvimento', 'SEO', 12),
  ('Desenvolvimento', 'Performance', 13),
  ('Desenvolvimento', 'Formulários', 14),
  ('Publicação', 'Domínio', 15),
  ('Publicação', 'DNS', 16),
  ('Publicação', 'Deploy', 17),
  ('Publicação', 'Analytics', 18),
  ('Publicação', 'Search Console', 19),
  ('Publicação', 'Favicon', 20),
  ('Publicação', 'Meta tags', 21),
  ('Entrega', 'Revisão cliente', 22),
  ('Entrega', 'Aprovação', 23),
  ('Entrega', 'Pagamento', 24),
  ('Entrega', 'Entrega final', 25)
) as i(group_label, label, position)
where t.name = 'Padrão — Site institucional';
