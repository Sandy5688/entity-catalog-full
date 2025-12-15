import { jest } from '@jest/globals';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  database: process.env.DB_NAME || 'entity_catalog',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

describe('Database Migrations Validation', () => {
  afterAll(async () => {
    await pool.end();
  });

  test('entity_catalog table exists with correct columns', async () => {
    const res = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name='entity_catalog';
    `);

    const columns = res.rows.map((r) => r.column_name);
    expect(columns).toEqual(expect.arrayContaining([
      'id',
      'display_name',
      'slug',
      'entity_category',
      'primary_country',
      'primary_subregion',
      'website_url',
      'info_page_url',
      'contact_url',
      'contact_email',
      'source',
      'processing_notes',
      'coverage_regions',
      'is_active',
      'created_at',
      'updated_at',
    ]));
  });

  test('metadata_catalog table exists with correct columns', async () => {
    const res = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name='metadata_catalog';
    `);

    const columns = res.rows.map((r) => r.column_name);
    expect(columns).toEqual(expect.arrayContaining([
      'id',
      'entity_id',
      'package_name',
      'package_key',
      'raw_data',
      'features',
      'source',
      'imported_at',
    ]));
  });

  test('unique index on entity_catalog(slug, primary_country) exists', async () => {
    const res = await pool.query(`
      SELECT indexname
      FROM pg_indexes
      WHERE tablename='entity_catalog';
    `);

    const indexes = res.rows.map((r) => r.indexname);
    expect(indexes).toContain('idx_slug_country');
  });

  test('metadata_catalog(entity_id) index exists', async () => {
    const res = await pool.query(`
      SELECT indexname
      FROM pg_indexes
      WHERE tablename='metadata_catalog';
    `);

    const indexes = res.rows.map((r) => r.indexname);
    expect(indexes).toContain('idx_metadata_entity');
  });

  test('updated_at triggers exist for entity_catalog', async () => {
    const res = await pool.query(`
      SELECT tgname
      FROM pg_trigger
      WHERE tgrelid = 'entity_catalog'::regclass;
    `);

    const triggers = res.rows.map((r) => r.tgname);
    expect(triggers).toContain('set_entity_updated_at');
  });

  test('updated_at triggers exist for metadata_catalog', async () => {
    const res = await pool.query(`
      SELECT tgname
      FROM pg_trigger
      WHERE tgrelid = 'metadata_catalog'::regclass;
    `);

    const triggers = res.rows.map((r) => r.tgname);
    expect(triggers).toContain('set_metadata_updated_at');
  });
});
