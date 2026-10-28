import { formatMoney } from './money.js';
export const accountDto = (a) => ({ id: a.id, name: a.name, balance: formatMoney(a.balance), created_at: a.created_at.toISOString() });
export const balanceDto = (a) => ({ account_id: a.id, balance: formatMoney(a.balance) });
export const transactionDto = (t) => ({ id: t.id, account_id: t.account_id, type: t.type, amount: formatMoney(t.amount), description: t.description, reference_id: t.reference_id, created_at: t.created_at.toISOString() });
