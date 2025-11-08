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

  it('POST /api/auth/login - Erreur si username manquant', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ });
    expect(response.status).toBe(400);
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

  it('GET /api/auth/secure-data - Token invalide -> 403', async () => {
    const response = await request(app)
      .get('/api/auth/secure-data')
      .set('Authorization', 'Bearer invalid.token.here');
    expect([401,403]).toContain(response.status);
  });
});
