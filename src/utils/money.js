import { AppError } from '../errors/app-error.js';

// Amounts cross the HTTP boundary as strings and are stored as integer cents.
const MONEY = /^(?:0|[1-9]\d{0,11})\.\d{2}$/;
export function parseMoney(value) {
  if (typeof value !== 'string' || !MONEY.test(value)) throw new AppError(400, 'VALIDATION_ERROR', 'amount must be a positive decimal string with exactly two fractional digits.');
  const cents = BigInt(value.replace('.', ''));
  if (cents <= 0n) throw new AppError(400, 'VALIDATION_ERROR', 'amount must be greater than zero.');
  return cents;
}
export function formatMoney(value) { const cents = BigInt(value); return `${cents / 100n}.${(cents % 100n).toString().padStart(2, '0')}`; }
