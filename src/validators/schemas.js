import { z } from 'zod';
import { AppError } from '../errors/app-error.js';

const uuid = z.string().uuid();
const amount = z.string().regex(/^(?:0|[1-9]\d{0,11})\.\d{2}$/, 'must be a decimal string with exactly two fractional digits');
export const accountSchema = z.object({ name: z.string().trim().min(1).max(120) }).strict();
export const transactionSchema = z.object({
  type: z.enum(['CREDIT', 'DEBIT']), amount, description: z.string().trim().max(500), reference_id: z.string().trim().min(1).max(120)
}).strict();
export const historySchema = z.object({
  type: z.enum(['CREDIT', 'DEBIT']).optional(), page: z.coerce.number().int().min(0).default(0), limit: z.coerce.number().int().min(1).max(100).default(10)
}).strict();
export function validate(schema, input) {
  const result = schema.safeParse(input);
  if (!result.success) throw new AppError(400, 'VALIDATION_ERROR', 'Request validation failed.', result.error.flatten());
  return result.data;
}
export function validAccountId(id) { const result = uuid.safeParse(id); if (!result.success) throw new AppError(400, 'VALIDATION_ERROR', 'accountId must be a UUID.'); return id; }
