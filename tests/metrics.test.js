import request from 'supertest';
import app from '../src/app.js';

describe('Metrics endpoint', () => {
  test('/metrics exposes Prometheus metrics', async () => {
    const res = await request(app).get('/metrics');

    expect(res.status).toBe(200);
    expect(res.text).toContain('entity_created_total');
    expect(res.text).toContain('metadata_packages_imported_total');
  });
});
