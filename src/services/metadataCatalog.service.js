import pool from './db.js';
import { metadataPackagesImportedTotal } from '../metrics/metrics.js';

/**
 * Store raw metadata package
 * @param {object} metadata
 * @returns {Promise<object>} inserted row
 */
export async function storeMetadata({ entity_id, package_name = null, package_key = null, raw_data = {}, features = {}, source = 'manual' }) {
  const query = `
    INSERT INTO metadata_catalog
      (entity_id, package_name, package_key, raw_data, features, source)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *;
  `;

  const values = [entity_id, package_name, package_key, raw_data, features, source];

  const res = await pool.query(query, values);
  metadataPackagesImportedTotal.inc();
  return res.rows[0];
}

// Optional: default export for backwards compatibility
export default { storeMetadata };
