import request from 'supertest';
import app from '../src/app';

describe('Auth Controller', () => {
  it('should return 404 for unknown auth route', async () => {
    const res = await request(app).get('/api/auth/unknown');
    expect(res.status).toBe(404);
  });
});
