import request from 'supertest';

// We must reset modules and unmock express-rate-limit (jest.setup.ts mocks it by default)
beforeAll(async () => {
  jest.resetModules();
  jest.unmock('express-rate-limit');
});

describe('Rate limiting (integration)', () => {
  let app: any;

  beforeAll(() => {
    // Load the app after unmocking so real express-rate-limit is used
    app = require('../index').default;
  });

  it('should allow first IA generation and block the second (429)', async () => {
    const payload = { prompt: 'Marketplace pour coachs sportifs, features principales et roadmap' };

    // 1st request should succeed
    const res1 = await request(app).post('/api/ai/generate').send(payload);
    expect([200, 201]).toContain(res1.status);
    expect(res1.body).toBeDefined();

    // 2nd immediate request should be rate-limited (429)
    const res2 = await request(app).post('/api/ai/generate').send(payload);
    expect(res2.status).toBe(429);
    expect(res2.body).toHaveProperty('message');
  });
});
