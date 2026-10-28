export const openapi = {
  openapi: '3.0.3', info: { title: 'Transaction Ledger API', version: '1.0.0' },
  paths: {
    '/health': { get: { summary: 'Health check', responses: { 200: { description: 'OK' } } } },
    '/api/v1/accounts': { post: { summary: 'Create an account', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name'], additionalProperties: false, properties: { name: { type: 'string' } } } } } }, responses: { 201: { description: 'Created' }, 400: { description: 'Validation error' } } } },
    '/api/v1/accounts/{accountId}/balance': { get: { summary: 'Get persisted account balance', parameters: [{ name: 'accountId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { 200: { description: 'Balance' }, 404: { description: 'Missing account' } } } },
    '/api/v1/accounts/{accountId}/transactions': { post: { summary: 'Create credit or debit', responses: { 201: { description: 'Created' }, 409: { description: 'Duplicate reference or insufficient funds' } } }, get: { summary: 'List transactions', responses: { 200: { description: 'History' } } } },
    '/api/v1/transfers': { post: { summary: 'Atomically transfer funds between two accounts', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['source_account_id', 'destination_account_id', 'amount', 'description', 'reference_id'], additionalProperties: false, properties: { source_account_id: { type: 'string', format: 'uuid' }, destination_account_id: { type: 'string', format: 'uuid' }, amount: { type: 'string', pattern: '^\\d+\\.\\d{2}$' }, description: { type: 'string' }, reference_id: { type: 'string' } } } } } }, responses: { 201: { description: 'Transferred' }, 404: { description: 'Missing account' }, 409: { description: 'Insufficient funds or duplicate reference' } } } }
  }
};
