import pool from '../services/db.js';

export async function getEntityById(req, res) {
  const { id } = req.params;

  const result = await pool.query(
    'SELECT * FROM entity_catalog WHERE id = $1',
    [id]
  );

  if (!result.rows.length) {
    return res.status(404).json({ message: 'Entity not found' });
  }

  res.json(result.rows[0]);
}

export async function listEntities(req, res) {
  const result = await pool.query(
    'SELECT * FROM entity_catalog WHERE is_active = true'
  );

  res.json(result.rows);
}
