import { z } from "zod";

const optionalUuid = z.string().optional().transform((v) => (v ? v : undefined));
const emptyToUndefined = (v: unknown) => (v === "" ? undefined : v);

export const createProposalSchema = z.object({
  lead_id: optionalUuid,
  client_id: optionalUuid,
  project_id: optionalUuid,
  title: z.string().trim().min(1, "Informe um título"),
  value: z.coerce.number().positive("Informe um valor"),
  valid_until: z.preprocess(emptyToUndefined, z.string().optional()),
  payment_terms: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  payment_method: z.preprocess(emptyToUndefined, z.string().trim().optional()),
});

export const updateProposalStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["draft", "sent", "viewed", "negotiation", "accepted", "rejected", "expired"]),
  rejected_reason_id: z.string().optional(),
});
