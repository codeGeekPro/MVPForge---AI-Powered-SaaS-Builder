import request from 'supertest';
import app from '../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('AI Generation API', () => {
  beforeEach(async () => {
    await prisma.mvp.deleteMany();
  });

  describe('POST /api/ai/generate', () => {
    it('devrait générer un MVP avec prompt valide', async () => {
      const response = await request(app)
        .post('/api/ai/generate')
        .send({ prompt: 'Marketplace pour coachs sportifs' })
        .expect(200);
      
      expect(response.body.mvp).toBeDefined();
      expect(response.body.mvp.length).toBeGreaterThan(10);
    });
    
    it('devrait rejeter un prompt trop court', async () => {
      await request(app)
        .post('/api/ai/generate')
        .send({ prompt: 'app' })
        .expect(400);
    });
    
    it('devrait rejeter un prompt trop long', async () => {
      await request(app)
        .post('/api/ai/generate')
        .send({ prompt: 'a'.repeat(3000) })
        .expect(400);
    });
    
    // Rate limit déjà couvert dans rate-limit.test.ts (éviter conflit mock)
  });
  
  describe('GET /api/health', () => {
    it("devrait retourner le statut de santé", async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body.status).toBe('OK');
      expect(response.body.checks.database).toBe('ok');
    });
  });
});
