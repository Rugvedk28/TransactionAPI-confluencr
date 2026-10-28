import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

if (!process.env.RUN_INTEGRATION_TESTS) test('PostgreSQL integration suite is opt-in', { skip: 'Set RUN_INTEGRATION_TESTS=true with DATABASE_URL to run.' }, () => {});
else {
  const { pool } = await import('../../src/config/database.js');
  const { createApp } = await import('../../src/app.js'); const app = createApp();
  before(async () => { await pool.query('TRUNCATE transactions, accounts'); }); after(() => pool.end());
  const createAccount = async (name = 'Test User') => (await request(app).post('/api/v1/accounts').send({ name })).body;
  test('account creation, credit, debit, and persisted balance', async () => { const a = await createAccount(); assert.equal(a.balance, '0.00'); await request(app).post(`/api/v1/accounts/${a.id}/transactions`).send({ type: 'CREDIT', amount: '50.00', description: 'fund', reference_id: 'one' }).expect(201); await request(app).post(`/api/v1/accounts/${a.id}/transactions`).send({ type: 'DEBIT', amount: '20.00', description: 'spend', reference_id: 'two' }).expect(201); assert.equal((await request(app).get(`/api/v1/accounts/${a.id}/balance`)).body.balance, '30.00'); });
  test('a duplicate reference and insufficient debit leave balance unchanged', async () => { const a = await createAccount(); const body = { type: 'CREDIT', amount: '10.00', description: 'fund', reference_id: 'same' }; await request(app).post(`/api/v1/accounts/${a.id}/transactions`).send(body).expect(201); await request(app).post(`/api/v1/accounts/${a.id}/transactions`).send(body).expect(409); await request(app).post(`/api/v1/accounts/${a.id}/transactions`).send({ type: 'DEBIT', amount: '11.00', description: 'no', reference_id: 'no' }).expect(409); assert.equal((await request(app).get(`/api/v1/accounts/${a.id}/balance`)).body.balance, '10.00'); });
  test('concurrent debits serialize and cannot overdraw', async () => { const a = await createAccount(); await request(app).post(`/api/v1/accounts/${a.id}/transactions`).send({ type: 'CREDIT', amount: '10.00', description: 'seed', reference_id: 'seed' }); const responses = await Promise.all(['a', 'b'].map((reference_id) => request(app).post(`/api/v1/accounts/${a.id}/transactions`).send({ type: 'DEBIT', amount: '10.00', description: 'race', reference_id }))); assert.deepEqual(responses.map((r) => r.status).sort(), [201, 409]); assert.equal((await request(app).get(`/api/v1/accounts/${a.id}/balance`)).body.balance, '0.00'); });
  test('history filters and paginates newest first', async () => { const a = await createAccount(); for (const [type, reference_id] of [['CREDIT', 'h1'], ['DEBIT', 'h2'], ['CREDIT', 'h3']]) { const amount = type === 'CREDIT' ? '2.00' : '1.00'; await request(app).post(`/api/v1/accounts/${a.id}/transactions`).send({ type, amount, description: reference_id, reference_id }).expect(201); } const all = await request(app).get(`/api/v1/accounts/${a.id}/transactions?limit=2&page=0`).expect(200); assert.equal(all.body.transactions.length, 2); assert.deepEqual(all.body.pagination, { page: 0, limit: 2, total_records: 3, total_pages: 2 }); const credits = await request(app).get(`/api/v1/accounts/${a.id}/transactions?type=CREDIT`).expect(200); assert.equal(credits.body.transactions.length, 2); });
  test('concurrent duplicate references create exactly one ledger entry', async () => { const a = await createAccount(); const body = { type: 'CREDIT', amount: '3.00', description: 'same', reference_id: 'race-reference' }; const r = await Promise.all([request(app).post(`/api/v1/accounts/${a.id}/transactions`).send(body), request(app).post(`/api/v1/accounts/${a.id}/transactions`).send(body)]); assert.deepEqual(r.map((x) => x.status).sort(), [201, 409]); assert.equal((await request(app).get(`/api/v1/accounts/${a.id}/balance`)).body.balance, '3.00'); });
  test('transfers debit and credit atomically, including rollback failures', async () => {
    const source = await createAccount('Source'); const destination = await createAccount('Destination');
    await request(app).post(`/api/v1/accounts/${source.id}/transactions`).send({ type: 'CREDIT', amount: '20.00', description: 'seed', reference_id: 'seed' }).expect(201);
    const transfer = { source_account_id: source.id, destination_account_id: destination.id, amount: '12.00', description: 'payment', reference_id: 'transfer-1' };
    const completed = await request(app).post('/api/v1/transfers').send(transfer).expect(201);
    assert.equal(completed.body.source_transaction.type, 'DEBIT'); assert.equal(completed.body.destination_transaction.type, 'CREDIT');
    assert.equal(completed.body.source_balance_after, '8.00'); assert.equal(completed.body.destination_balance_after, '12.00');
    await request(app).post('/api/v1/transfers').send({ ...transfer, amount: '9.00', reference_id: 'transfer-2' }).expect(409);
    assert.equal((await request(app).get(`/api/v1/accounts/${source.id}/balance`)).body.balance, '8.00');
    assert.equal((await request(app).get(`/api/v1/accounts/${destination.id}/balance`)).body.balance, '12.00');
    await request(app).post('/api/v1/transfers').send({ ...transfer, amount: '1.00' }).expect(409);
    assert.equal((await request(app).get(`/api/v1/accounts/${source.id}/balance`)).body.balance, '8.00');
    assert.equal((await request(app).get(`/api/v1/accounts/${destination.id}/balance`)).body.balance, '12.00');
    await request(app).post('/api/v1/transfers').send({ ...transfer, destination_account_id: '00000000-0000-0000-0000-000000000001', amount: '1.00', reference_id: 'transfer-3' }).expect(404);
    assert.equal((await request(app).get(`/api/v1/accounts/${source.id}/balance`)).body.balance, '8.00');
  });
}
