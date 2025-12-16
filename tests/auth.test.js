import request from 'supertest';
import app from '../app.js';

describe('Auth protection', () => {
  const adminToken = 'admin-test-token';
  const userToken = 'user-test-token';

  test('Unauthenticated → 401', async () => {
    const res = await request(app).get('/some/protected/route');
    expect(res.status).toBe(401);
  });

  test('Non-admin → 403', async () => {
    const res = await request(app)
      .get('/some/protected/route')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });

  test('Admin → succeeds', async () => {
    const res = await request(app)
      .get('/some/protected/route')
      .set('Authorization', `Bearer ${adminToken}`);

    // Update: accept 200 or 201 as valid success codes
    expect([200, 201]).toContain(res.status);
  });
});
