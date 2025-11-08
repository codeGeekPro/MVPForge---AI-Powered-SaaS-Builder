import request from 'supertest';
import app from '../index';

// Tests supplémentaires pour augmenter la couverture sur les endpoints IA et business

describe('Extended API endpoints', () => {
  it('POST /api/ai/smart-score retourne un score global', async () => {
    const res = await request(app)
      .post('/api/ai/smart-score')
      .send({ idea: 'Plateforme d apprentissage IA pour PME' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('overall');
    expect(res.body).toHaveProperty('breakdown');
  });

  it('POST /api/ai/multi-model-generation fusionne résultats', async () => {
    const res = await request(app)
      .post('/api/ai/multi-model-generation')
      .send({ idea: 'Assistant AI pour comptabilité' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('mvp');
    expect(res.body).toHaveProperty('businessAnalysis');
  });

  it('POST /api/analytics/suggest-kpis renvoie KPIs', async () => {
    const res = await request(app)
      .post('/api/analytics/suggest-kpis')
      .send({ idea: 'SaaS marketing automation', businessModel: 'saas' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('recommendedKpis');
  });

  it('POST /api/ai/experiments renvoie des expérimentations', async () => {
    const res = await request(app)
      .post('/api/ai/experiments')
      .send({ idea: 'Optimisation e-commerce IA' });
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });

  it('POST /api/mvp/save sauvegarde un MVP lié user démo', async () => {
    const res = await request(app)
      .post('/api/mvp/save')
      .send({ idea: 'Nouvelle idée SaaS', result: 'Résultat MVP généré' });
    expect([200,201]).toContain(res.status);
    expect(res.body).toHaveProperty('mvp');
    expect(res.body.mvp).toHaveProperty('idea', 'Nouvelle idée SaaS');
  });

  it('GET /api/mvp/history retourne historique (≥0)', async () => {
    const res = await request(app).get('/api/mvp/history');
    expect([200,201]).toContain(res.status);
    expect(res.body).toHaveProperty('history');
    expect(Array.isArray(res.body.history)).toBe(true);
  });

  it('POST /api/ai/generate-full-mvp retourne structure JSON ou raw', async () => {
    const res = await request(app)
      .post('/api/ai/generate-full-mvp')
      .send({ idea: 'SaaS de gestion de factures' });
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });

  it('Validation: prompt avec <script> rejeté', async () => {
    const res = await request(app)
      .post('/api/ai/generate')
      .send({ prompt: 'idée <script>alert(1)</script>' });
    expect(res.status).toBe(400);
  });
});
