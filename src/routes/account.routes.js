import { Router } from 'express';
import { createAccount, getBalance } from '../controllers/account.controller.js';
import { createTransaction, listTransactions } from '../controllers/transaction.controller.js';
import { asyncHandler } from '../utils/async-handler.js';
export const accountRouter = Router();
accountRouter.post('/', asyncHandler(createAccount));
accountRouter.get('/:accountId/balance', asyncHandler(getBalance));
accountRouter.post('/:accountId/transactions', asyncHandler(createTransaction));
accountRouter.get('/:accountId/transactions', asyncHandler(listTransactions));
