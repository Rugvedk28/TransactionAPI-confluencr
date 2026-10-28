export const accountRepository = {
  async create(db, { id, name }) { return (await db.query('INSERT INTO accounts (id, name) VALUES ($1, $2) RETURNING *', [id, name])).rows[0]; },
  async find(db, id) { return (await db.query('SELECT * FROM accounts WHERE id = $1', [id])).rows[0]; },
  async lock(db, id) { return (await db.query('SELECT * FROM accounts WHERE id = $1 FOR UPDATE', [id])).rows[0]; },
  async lockMany(db, ids) {
    const { rows } = await db.query('SELECT * FROM accounts WHERE id = ANY($1::uuid[]) ORDER BY id FOR UPDATE', [ids]);
    return rows;
  },
  async setBalance(db, id, balance) { return (await db.query('UPDATE accounts SET balance = $2 WHERE id = $1 RETURNING *', [id, balance.toString()])).rows[0]; }
};
