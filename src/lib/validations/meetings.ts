import { z } from "zod";

const optionalUuid = z.string().optional().transform((v) => (v ? v : undefined));
const emptyToUndefined = (v: unknown) => (v === "" ? undefined : v);

export const createMeetingSchema = z.object({
  lead_id: optionalUuid,
  client_id: optionalUuid,
  project_id: optionalUuid,
  title: z.string().trim().min(1, "Informe um título"),
  date: z.string().min(1, "Informe a data"),
  time: z.string().min(1, "Informe o horário"),
  format: z.enum(["online", "in_person"]).default("online"),
  location: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  link: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  objective: z.preprocess(emptyToUndefined, z.string().trim().optional()),
});

export const updateMeetingStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["scheduled", "done", "canceled", "no_show"]),
});
