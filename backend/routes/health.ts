import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import fetch from 'node-fetch';
import { register } from '../lib/metrics';

const router = Router();
const prisma = new PrismaClient();

function getRedisClient(): Redis | null {
  try {
    if (!process.env.REDIS_URL) return null;
    return new Redis(process.env.REDIS_URL);
  } catch {
    return null;
  }
}

async function notifySlack(message: string) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    });
  } catch {
    // ignorer en silence
  }
}

router.get('/health', async (_req, res) => {
  const health: any = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {},
  };

  // Check database
  try {
    // @ts-ignore - template tag raw ok
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = 'ok';
  } catch (error) {
    health.checks.database = 'error';
    health.status = 'DEGRADED';
  }

  // Check Redis (si configuré)
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.ping();
      health.checks.redis = 'ok';
    } catch (error) {
      health.checks.redis = 'error';
      health.status = 'DEGRADED';
    } finally {
      try { await redis.quit(); } catch {}
    }
  } else {
    health.checks.redis = 'missing';
  }

  // Check OpenAI (présence clé)
  try {
    health.checks.openai = process.env.OPENAI_API_KEY ? 'ok' : 'missing';
  } catch (error) {
    health.checks.openai = 'error';
  }

  // Optional: ping Betterstack heartbeat
  if (process.env.BETTERSTACK_HEARTBEAT_URL && health.status === 'OK') {
    fetch(process.env.BETTERSTACK_HEARTBEAT_URL).catch(() => {});
  }

  const statusCode = health.status === 'OK' ? 200 : 503;
  if (statusCode !== 200) {
    notifySlack(`⚠️ Health degraded: ${JSON.stringify(health)}`);
  }
  res.status(statusCode).json(health);
});

// Métriques Prometheus text/plain
router.get('/metrics', async (_req, res) => {
  res.setHeader('Content-Type', register.contentType);
  const metrics = await register.metrics();
  res.send(metrics);
});

export default router;
