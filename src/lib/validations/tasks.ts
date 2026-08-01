import { z } from "zod";

const optionalUuid = z.string().optional().transform((v) => (v ? v : undefined));
const emptyToUndefined = (v: unknown) => (v === "" ? undefined : v);

export const createTaskSchema = z.object({
  lead_id: optionalUuid,
  client_id: optionalUuid,
  project_id: optionalUuid,
  title: z.string().trim().min(1, "Informe um título"),
  description: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  due_at: z.preprocess(emptyToUndefined, z.string().optional()),
});

export const updateTaskStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "in_progress", "done"]),
});
