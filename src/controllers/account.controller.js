import { accountService } from '../services/account.service.js';
import { accountSchema, validAccountId, validate } from '../validators/schemas.js';
import { accountDto, balanceDto } from '../utils/serializers.js';
export const createAccount = async (req, res) => res.status(201).json(accountDto(await accountService.create(validate(accountSchema, req.body))));
export const getBalance = async (req, res) => { validAccountId(req.params.accountId); res.json(balanceDto(await accountService.balance(req.params.accountId))); };
