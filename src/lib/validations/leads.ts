import { z } from "zod";

const optionalUuid = z
  .string()
  .optional()
  .transform((v) => (v ? v : undefined));

const emptyToUndefined = (v: unknown) => (v === "" ? undefined : v);

export const createLeadSchema = z.object({
  company_name: z.string().trim().min(1, "Informe o nome da empresa"),
  contact_name: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  whatsapp: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  city: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  segment_id: optionalUuid,
  source_id: optionalUuid,
});
export type CreateLeadInput = z.infer<typeof createLeadSchema>;

export const updateLeadSchema = z.object({
  id: z.string().uuid(),
  company_name: z.string().trim().min(1, "Informe o nome da empresa"),
  contact_name: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  segment_id: optionalUuid,
  city: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  state: z.preprocess(emptyToUndefined, z.string().trim().max(2).optional()),
  whatsapp: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  phone: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  email: z.preprocess(emptyToUndefined, z.string().trim().email().optional()),
  instagram: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  website_url: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  google_maps_url: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  source_id: optionalUuid,
  has_website: z.coerce.boolean().optional(),
  website_quality: z.enum(["none", "very_bad", "bad", "average", "good"]).optional(),
  pilot_created: z.coerce.boolean().optional(),
  pilot_url: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  estimated_value: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : Number(v)),
    z.number().nonnegative().optional()
  ),
  notes: z.preprocess(emptyToUndefined, z.string().trim().optional()),
});
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;

export const moveLeadStageSchema = z.object({
  id: z.string().uuid(),
  stage_id: z.string().uuid(),
  position: z.number(),
});

export const logContactSchema = z.object({
  lead_id: optionalUuid,
  client_id: optionalUuid,
  type: z.enum(["whatsapp", "call", "instagram", "email", "meeting", "other"]),
  summary: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  outcome: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  next_action: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  next_action_at: z.preprocess(emptyToUndefined, z.string().optional()),
});

export const addNoteSchema = z.object({
  lead_id: optionalUuid,
  client_id: optionalUuid,
  project_id: optionalUuid,
  body: z.string().trim().min(1, "Escreva a nota"),
});

export const markLostSchema = z.object({
  id: z.string().uuid(),
  loss_reason_id: z.string().uuid("Selecione um motivo"),
  loss_notes: z.preprocess(emptyToUndefined, z.string().trim().optional()),
});

export const convertToClientSchema = z.object({
  id: z.string().uuid(),
});

export const setTemperatureSchema = z.object({
  id: z.string().uuid(),
  temperature: z.enum(["hot", "warm", "cold", "none"]),
});
