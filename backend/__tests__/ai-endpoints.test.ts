import request from 'supertest';
import app from '../index';

describe('Endpoints IA', () => {
  it('POST /api/ai/generate - Génération IA', async () => {
    const response = await request(app)
      .post('/api/ai/generate')
      .send({ prompt: 'Créer une marketplace pour coachs sportifs indépendants' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('mvp');
  });

  it('POST /api/ai/classify - Classification IA', async () => {
    const response = await request(app)
      .post('/api/ai/classify')
      .send({ idea: 'Plateforme de mise en relation artistes/clients avec IA' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('classification');
  });
});
