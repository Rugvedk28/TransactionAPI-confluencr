import { AppError } from '../errors/app-error.js';
export function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  let known = error;
  if (error instanceof SyntaxError && 'body' in error) known = new AppError(400, 'VALIDATION_ERROR', 'Malformed JSON request body.');
  if (error.code === '23505' && error.constraint === 'transactions_account_reference_unique') known = new AppError(409, 'DUPLICATE_REFERENCE', 'A transaction with this reference_id already exists for this account.');
  if (!(known instanceof AppError)) { console.error(error); known = new AppError(500, 'INTERNAL_ERROR', 'An unexpected error occurred.'); }
  res.status(known.status).json({ timestamp: new Date().toISOString(), status: known.status, error: known.code, message: known.message, path: req.originalUrl, ...(known.details ? { details: known.details } : {}) });
}
