import { z } from "zod";

const emptyToUndefined = (v: unknown) => (v === "" ? undefined : v);

export const createProjectSchema = z.object({
  client_id: z.string().uuid("Selecione um cliente"),
  name: z.string().trim().min(1, "Informe o nome do projeto"),
  type: z.enum(["landing_page", "institutional", "redesign", "portfolio", "professional", "other"]).default("other"),
  value: z.preprocess((v) => (v === "" || v === undefined ? undefined : Number(v)), z.number().nonnegative().optional()),
  due_date: z.preprocess(emptyToUndefined, z.string().optional()),
});

export const updateProjectStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum([
    "briefing_pending",
    "awaiting_materials",
    "planning",
    "design",
    "development",
    "internal_review",
    "client_review",
    "awaiting_approval",
    "deploy",
    "finished",
    "post_sale",
  ]),
});

export const toggleChecklistItemSchema = z.object({
  id: z.string().uuid(),
  done: z.boolean(),
});

export const updateBriefingSchema = z.object({
  project_id: z.string().uuid(),
  about: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  services: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  target_audience: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  differentiators: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  goal: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  whatsapp: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  instagram: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  location: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  competitors: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  references_text: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  colors: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  logo_notes: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  photos_notes: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  domain_notes: z.preprocess(emptyToUndefined, z.string().trim().optional()),
});

export const updateDomainSchema = z.object({
  project_id: z.string().uuid(),
  domain_name: z.string().trim().min(1, "Informe o domínio"),
  registrar: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  registered_at: z.preprocess(emptyToUndefined, z.string().optional()),
  expires_at: z.preprocess(emptyToUndefined, z.string().optional()),
  cost: z.preprocess((v) => (v === "" || v === undefined ? undefined : Number(v)), z.number().nonnegative().optional()),
  paid_by: z.enum(["client", "fluxo"]).optional(),
  hosting: z.enum(["vercel", "railway", "other"]).optional(),
  dns_configured: z.coerce.boolean().optional(),
  final_url: z.preprocess(emptyToUndefined, z.string().trim().optional()),
});
