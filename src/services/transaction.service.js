import { randomUUID } from 'node:crypto';
import { withTransaction, pool } from '../config/database.js';
import { accountRepository } from '../repositories/account.repository.js';
import { transactionRepository } from '../repositories/transaction.repository.js';
import { AppError, notFound } from '../errors/app-error.js';
import { parseMoney } from '../utils/money.js';

export const transactionService = {
  async create(accountId, input) {
    const amount = parseMoney(input.amount);
    return withTransaction(async (db) => {
      // This lock serializes all balance-changing work for this account.
      const account = await accountRepository.lock(db, accountId);
      if (!account) throw notFound();
      const current = BigInt(account.balance);
      if (input.type === 'DEBIT' && current < amount) throw new AppError(409, 'INSUFFICIENT_BALANCE', 'The account does not have sufficient funds.');
      const next = input.type === 'CREDIT' ? current + amount : current - amount;
      await accountRepository.setBalance(db, accountId, next);
      // const transaction = await transactionRepository.create(db, { id: randomUUID(), accountId, amount, ...input, referenceId: input.reference_id });
      const transaction = await transactionRepository.create(db, {
      id: randomUUID(),
      accountId,
      type: input.type,
      amount,
      description: input.description,
      referenceId: input.reference_id
    });
      return { transaction, balanceAfter: next };
    });
  },
  async history(accountId, query) {
    const account = await accountRepository.find(pool, accountId); if (!account) throw notFound();
    const { rows, total } = await transactionRepository.list(pool, accountId, { ...query, offset: query.page * query.limit });
    return { rows, total };
  }
};
