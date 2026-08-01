-- Fluxo CRM — extensões e tipos enumerados
-- Tabelas "de opções" (pipeline_stages, lead_sources, segments, loss_reasons)
-- são tabelas, não enums, porque o requisito é permitir criar novas opções
-- pela tela de Configurações sem migration. Os enums abaixo são para campos
-- cujo conjunto de valores é parte da lógica do produto, não configuração do
-- usuário.

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create type website_quality_enum as enum ('none', 'very_bad', 'bad', 'average', 'good');
create type lead_temperature_enum as enum ('hot', 'warm', 'cold', 'none');
create type contact_type_enum as enum ('whatsapp', 'call', 'instagram', 'email', 'meeting', 'other');
create type follow_up_status_enum as enum ('pending', 'done', 'snoozed', 'canceled');
create type client_status_enum as enum ('active', 'inactive');

create type project_type_enum as enum (
  'landing_page', 'institutional', 'redesign', 'portfolio', 'professional', 'other'
);
create type project_status_enum as enum (
  'briefing_pending', 'awaiting_materials', 'planning', 'design', 'development',
  'internal_review', 'client_review', 'awaiting_approval', 'deploy', 'finished', 'post_sale'
);
create type briefing_status_enum as enum ('not_sent', 'sent', 'answered', 'incomplete', 'complete');
create type paid_by_enum as enum ('client', 'fluxo');
create type hosting_enum as enum ('vercel', 'railway', 'other');

create type meeting_type_enum as enum ('meeting', 'follow_up', 'presentation', 'deadline', 'delivery', 'task');
create type meeting_format_enum as enum ('online', 'in_person');
create type meeting_status_enum as enum ('scheduled', 'done', 'canceled', 'no_show');

create type proposal_status_enum as enum ('draft', 'sent', 'viewed', 'negotiation', 'accepted', 'rejected', 'expired');

create type task_priority_enum as enum ('high', 'medium', 'low');
create type task_status_enum as enum ('pending', 'in_progress', 'done');

create type transaction_kind_enum as enum ('income', 'expense');
create type expense_category_enum as enum ('domain', 'hosting', 'plugin', 'tool', 'freelancer', 'other');
create type transaction_status_enum as enum ('paid', 'pending', 'canceled');
create type payment_method_enum as enum ('pix', 'cash', 'transfer', 'card', 'other');
