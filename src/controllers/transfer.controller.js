import { transactionService } from '../services/transaction.service.js';
import { transferSchema, validate } from '../validators/schemas.js';
import { transactionDto } from '../utils/serializers.js';
import { formatMoney } from '../utils/money.js';

export const createTransfer = async (req, res) => {
  const result = await transactionService.transfer(validate(transferSchema, req.body));
  res.status(201).json({
    source_transaction: transactionDto(result.sourceTransaction),
    destination_transaction: transactionDto(result.destinationTransaction),
    source_balance_after: formatMoney(result.sourceBalanceAfter),
    destination_balance_after: formatMoney(result.destinationBalanceAfter)
  });
};
