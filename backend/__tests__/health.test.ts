import request from 'supertest';
import app from '../index';

describe('API Health & Metrics', () => {
  it('GET /api/health should return status OK and include checks', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
    expect(res.body).toHaveProperty('checks');
    expect(typeof res.body.uptime).toBe('number');
  });

  it('GET /api/metrics should return prometheus text', async () => {
    const res = await request(app).get('/api/metrics');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('http_requests_total');
  });
});
