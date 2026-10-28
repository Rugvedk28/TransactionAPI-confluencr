import { transactionService } from '../services/transaction.service.js';
import { historySchema, transactionSchema, validAccountId, validate } from '../validators/schemas.js';
import { transactionDto } from '../utils/serializers.js';
import { formatMoney } from '../utils/money.js';
export const createTransaction = async (req, res) => {
  validAccountId(req.params.accountId); const result = await transactionService.create(req.params.accountId, validate(transactionSchema, req.body));
  res.status(201).json({ ...transactionDto(result.transaction), balance_after: formatMoney(result.balanceAfter) });
};
export const listTransactions = async (req, res) => {
  validAccountId(req.params.accountId); const query = validate(historySchema, req.query); const { rows, total } = await transactionService.history(req.params.accountId, query);
  res.json({ account_id: req.params.accountId, transactions: rows.map(transactionDto), pagination: { page: query.page, limit: query.limit, total_records: total, total_pages: Math.ceil(total / query.limit) } });
};
