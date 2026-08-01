import { z } from "zod";

const optionalUuid = z.string().optional().transform((v) => (v ? v : undefined));
const emptyToUndefined = (v: unknown) => (v === "" ? undefined : v);

export const createTransactionSchema = z.object({
  client_id: optionalUuid,
  project_id: optionalUuid,
  description: z.string().trim().min(1, "Informe a descrição"),
  amount: z.coerce.number().positive("Informe um valor"),
  kind: z.enum(["income", "expense"]),
  expense_category: z.enum(["domain", "hosting", "plugin", "tool", "freelancer", "other"]).optional(),
  due_date: z.preprocess(emptyToUndefined, z.string().optional()),
  method: z.enum(["pix", "cash", "transfer", "card", "other"]).optional(),
});

export const updateTransactionStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["paid", "pending", "canceled"]),
});
