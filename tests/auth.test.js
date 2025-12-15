import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';

// 🔴 SET TEST SECRET EXPLICITLY
process.env.JWT_SECRET = 'test-secret';

describe('Auth protection', () => {
  test('Unauthenticated → 401', async () => {
    const res = await request(app).post('/entity/import/manual');
    expect(res.status).toBe(401);
  });

  test('Non-admin → 403', async () => {
    const token = jwt.sign(
      { id: 'user1', role: 'reader' },
      process.env.JWT_SECRET
    );

    const res = await request(app)
      .post('/entity/import/manual')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  test('Admin → succeeds', async () => {
    const adminToken = jwt.sign(
      { id: 'admin1', role: 'admin' },
      process.env.JWT_SECRET
    );

    const res = await request(app)
      .post('/entity/import/manual')
      .set('Authorization', `Bearer ${adminToken}`);

    expect([200, 201]).toContain(res.status);
  });
});
