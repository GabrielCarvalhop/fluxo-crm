-- Fluxo CRM — índices
-- Postgres não indexa FKs automaticamente; cobrimos as FKs usadas em join/filtro
-- mais os índices parciais/compostos que o motor de atenção e as listas usam.

-- Pipeline / leads
create index idx_leads_stage_position on leads (stage_id, position) where deleted_at is null;
create index idx_leads_next_follow_up on leads (next_follow_up_at) where deleted_at is null;
create index idx_leads_temperature on leads (temperature) where deleted_at is null;
create index idx_leads_owner on leads (owner_id) where deleted_at is null;
create index idx_leads_segment on leads (segment_id);
create index idx_leads_source on leads (source_id);
create index idx_leads_converted_client on leads (converted_client_id);
create index idx_leads_company_name_trgm on leads using gin (company_name gin_trgm_ops);

-- Clientes / projetos
create index idx_clients_lead on clients (lead_id);
create index idx_clients_company_name_trgm on clients using gin (company_name gin_trgm_ops);
create index idx_projects_client on projects (client_id) where deleted_at is null;
create index idx_projects_proposal on projects (proposal_id);
create index idx_projects_status on projects (status) where deleted_at is null;
create index idx_projects_due_date on projects (due_date) where deleted_at is null;
create index idx_projects_name_trgm on projects using gin (name gin_trgm_ops);

-- Registro de contato / notas / tags
create index idx_lead_contacts_lead on lead_contacts (lead_id);
create index idx_lead_contacts_client on lead_contacts (client_id);
create index idx_lead_contacts_contacted_at on lead_contacts (contacted_at desc);
create index idx_notes_lead on notes (lead_id);
create index idx_notes_client on notes (client_id);
create index idx_notes_project on notes (project_id);
create index idx_lead_tags_tag on lead_tags (tag_id);
create index idx_client_tags_tag on client_tags (tag_id);

-- Follow-ups
create index idx_follow_ups_lead on follow_ups (lead_id);
create index idx_follow_ups_client on follow_ups (client_id);
create index idx_follow_ups_due_pending on follow_ups (due_at) where status = 'pending';

-- Checklist / briefing / domínio
create index idx_checklist_groups_project on project_checklist_groups (project_id);
create index idx_checklist_items_group on project_checklist_items (group_id);
create index idx_domains_project on domains (project_id);
create index idx_domains_expires_at on domains (expires_at);

-- Reuniões / tarefas
create index idx_meetings_lead on meetings (lead_id);
create index idx_meetings_client on meetings (client_id);
create index idx_meetings_project on meetings (project_id);
create index idx_meetings_starts_at on meetings (starts_at);
create index idx_tasks_lead on tasks (lead_id);
create index idx_tasks_client on tasks (client_id);
create index idx_tasks_project on tasks (project_id);
create index idx_tasks_due_open on tasks (due_at) where status <> 'done';
create index idx_tasks_assignee on tasks (assignee_id);

-- Propostas
create index idx_proposals_lead on proposals (lead_id);
create index idx_proposals_client on proposals (client_id);
create index idx_proposals_project on proposals (project_id);
create index idx_proposals_status on proposals (status) where deleted_at is null;
create index idx_proposals_valid_until on proposals (valid_until);

-- Financeiro
create index idx_financial_client on financial_transactions (client_id);
create index idx_financial_project on financial_transactions (project_id);
create index idx_financial_proposal on financial_transactions (proposal_id);
create index idx_financial_due_status on financial_transactions (due_date, status) where deleted_at is null;

-- Log e arquivos
create index idx_activity_logs_entity on activity_logs (entity_type, entity_id, created_at desc);
create index idx_files_entity on files (entity_type, entity_id);
