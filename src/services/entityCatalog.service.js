import pool from './db.js';
import { entityCreatedTotal, entityUpdatedTotal } from '../metrics/metrics.js';

/**
 * Insert or update entity
 */
export async function insertOrUpdateEntity(entity) {
  const { display_name, slug, entity_category, primary_country, source = 'manual' } = entity;

  if (!display_name || !slug) {
    throw new Error('display_name and slug are required');
  }

  const existing = await pool.query(
    `SELECT id FROM entity_catalog
     WHERE slug=$1 AND primary_country=$2`,
    [slug, primary_country]
  );

  if (existing.rows.length) {
    await pool.query(
      `UPDATE entity_catalog
       SET display_name=$1,
           entity_category=$2,
           source=$3,
           updated_at=now()
       WHERE id=$4`,
      [display_name, entity_category, source, existing.rows[0].id]
    );

    entityUpdatedTotal.inc();
    return { id: existing.rows[0].id, updated: true };
  }

  const res = await pool.query(
    `INSERT INTO entity_catalog
     (display_name, slug, entity_category, primary_country, source)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [display_name, slug, entity_category, primary_country, source]
  );

  entityCreatedTotal.inc();
  return res.rows[0];
}

/**
 * Merge two entities (admin-only)
 */
export async function mergeEntityRecords({ sourceId, targetId, dryRun = false }) {
  if (!sourceId || !targetId) {
    throw new Error('sourceId and targetId are required');
  }

  if (dryRun) {
    return { dryRun: true, sourceId, targetId };
  }

  await pool.query(
    `UPDATE metadata_catalog
     SET entity_id=$1
     WHERE entity_id=$2`,
    [targetId, sourceId]
  );

  await pool.query(
    `UPDATE entity_catalog
     SET is_active=false, updated_at=now()
     WHERE id=$1`,
    [sourceId]
  );

  entityUpdatedTotal.inc();

  return { merged: true, sourceId, targetId };
}

export default {
  insertOrUpdateEntity,
  mergeEntityRecords,
};
