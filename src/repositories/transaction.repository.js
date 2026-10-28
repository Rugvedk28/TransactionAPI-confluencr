export const transactionRepository = {
  async create(db, transaction) {
    const q = `INSERT INTO transactions (id, account_id, type, amount, description, reference_id)
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
    return (await db.query(q, [transaction.id, transaction.accountId, transaction.type, transaction.amount.toString(), transaction.description, transaction.referenceId])).rows[0];
  },
  async list(db, accountId, { type, limit, offset }) {
    const where = type ? 'account_id = $1 AND type = $2' : 'account_id = $1';
    const params = type ? [accountId, type, limit, offset] : [accountId, limit, offset];
    const p = type ? '$3' : '$2'; const o = type ? '$4' : '$3';
    const rows = await db.query(`SELECT * FROM transactions WHERE ${where} ORDER BY created_at DESC, id DESC LIMIT ${p} OFFSET ${o}`, params);
    const total = await db.query(`SELECT count(*)::int AS total FROM transactions WHERE ${where}`, type ? [accountId, type] : [accountId]);
    return { rows: rows.rows, total: total.rows[0].total };
  }
};
