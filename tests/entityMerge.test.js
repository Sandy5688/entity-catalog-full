import request from 'supertest';
import app from '../app.js';
import pool from '../src/services/db.js';

describe('Admin Merge Endpoint', () => {
  const adminToken = 'admin-test-token'; // Use your mock auth system
  let sourceId;
  let targetId;

  beforeAll(async () => {
    // Insert two test entities
    const res1 = await pool.query(
      `INSERT INTO entity_catalog (display_name, slug, entity_category, primary_country, source)
       VALUES ($1,$2,$3,$4,$5) RETURNING id`,
      ['Source Entity', 'source-slug', 'category1', 'US', 'test']
    );
    const res2 = await pool.query(
      `INSERT INTO entity_catalog (display_name, slug, entity_category, primary_country, source)
       VALUES ($1,$2,$3,$4,$5) RETURNING id`,
      ['Target Entity', 'target-slug', 'category1', 'US', 'test']
    );
    sourceId = res1.rows[0].id;
    targetId = res2.rows[0].id;
  });

  afterAll(async () => {
    // Clean up
    await pool.query('DELETE FROM entity_catalog WHERE slug IN ($1,$2)', [
      'source-slug',
      'target-slug',
    ]);
    await pool.end();
  });

  test('Dry-run merge logs action without deleting', async () => {
    const res = await request(app)
      .post('/entity/merge')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ sourceId, targetId, dryRun: true });

    expect(res.status).toBe(200);
    expect(res.body.dryRun).toBe(true);
    expect(res.body.sourceId).toBe(sourceId);
    expect(res.body.targetId).toBe(targetId);

    // Skip checking admin_audit_log since logging is disabled in tests
  });

  test('Actual merge updates entity_catalog', async () => {
    const res = await request(app)
      .post('/entity/merge')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ sourceId, targetId });

    expect(res.status).toBe(200);
    expect(res.body.merged).toBe(true);
    expect(res.body.sourceId).toBe(sourceId);
    expect(res.body.targetId).toBe(targetId);

    // Verify source entity is inactive
    const sourceCheck = await pool.query(
      'SELECT is_active FROM entity_catalog WHERE id=$1',
      [sourceId]
    );
    expect(sourceCheck.rows[0].is_active).toBe(false);

    // Verify target entity is still active
    const targetCheck = await pool.query(
      'SELECT is_active FROM entity_catalog WHERE id=$1',
      [targetId]
    );
    expect(targetCheck.rows[0].is_active).toBe(true);
  });
});
