import { z } from "zod";

export const simpleOptionTableSchema = z.enum(["lead_sources", "segments", "loss_reasons"]);

export const addSimpleOptionSchema = z.object({
  table: simpleOptionTableSchema,
  label: z.string().trim().min(1, "Informe um nome"),
});

export const toggleSimpleOptionSchema = z.object({
  table: simpleOptionTableSchema,
  id: z.string().uuid(),
  active: z.boolean(),
});

export const addTagSchema = z.object({
  label: z.string().trim().min(1, "Informe um nome"),
});

export const upsertMessageTemplateSchema = z.object({
  id: z.string().optional(),
  key: z.string().trim().min(1),
  title: z.string().trim().min(1, "Informe um título"),
  body: z.string().trim().min(1, "Informe o texto"),
});

export const addPipelineStageSchema = z.object({
  key: z.string().trim().min(1),
  label: z.string().trim().min(1, "Informe um nome"),
  color: z.string().trim().min(1),
});

export const updatePipelineStageSchema = z.object({
  id: z.string().uuid(),
  label: z.string().trim().min(1).optional(),
  color: z.string().trim().min(1).optional(),
  active: z.boolean().optional(),
});

export const addChecklistItemSchema = z.object({
  template_id: z.string().uuid(),
  group_label: z.string().trim().min(1),
  label: z.string().trim().min(1, "Informe o item"),
});

export const updateProfileSchema = z.object({
  full_name: z.string().trim().min(1, "Informe seu nome"),
});
