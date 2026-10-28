import { Router } from 'express';
import { createTransfer } from '../controllers/transfer.controller.js';
import { asyncHandler } from '../utils/async-handler.js';

export const transferRouter = Router();
transferRouter.post('/', asyncHandler(createTransfer));
