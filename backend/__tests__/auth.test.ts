import request from 'supertest';
import app from '../index';

describe('Endpoints Authentification', () => {
  it('POST /api/auth/login - Génération de token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('GET /api/auth/secure-data - Accès sécurisé avec token valide', async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser' });

    const token = loginResponse.body.token;

    const secureResponse = await request(app)
      .get('/api/auth/secure-data')
      .set('Authorization', `Bearer ${token}`);

    expect(secureResponse.status).toBe(200);
    expect(secureResponse.body).toHaveProperty('message', 'Données sécurisées');
  });

  it('GET /api/auth/secure-data - Accès refusé sans token', async () => {
    const response = await request(app).get('/api/auth/secure-data');
    expect(response.status).toBe(401);
  });
});
