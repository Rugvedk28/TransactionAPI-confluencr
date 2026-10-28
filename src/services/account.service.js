import { randomUUID } from 'node:crypto';
import { pool } from '../config/database.js';
import { accountRepository } from '../repositories/account.repository.js';
import { notFound } from '../errors/app-error.js';

export const accountService = {
  async create({ name }) { return accountRepository.create(pool, { id: randomUUID(), name }); },
  async balance(id) { const account = await accountRepository.find(pool, id); if (!account) throw notFound(); return account; }
};
