import rateLimit from 'express-rate-limit';
import Redis from 'ioredis';
import RedisStore from 'rate-limit-redis';

// Crée un store Redis si REDIS_URL est défini, sinon fallback en mémoire
function createStore(prefix: string) {
  const url = process.env.REDIS_URL;
  if (!url) return undefined; // Fallback to MemoryStore

  const client = new Redis(url);
  // rate-limit-redis pour express-rate-limit v7
  return new (RedisStore as any)({
    // ioredis: passer la méthode sendCommand sous forme compatible
    sendCommand: (...args: any[]) => (client as any).call(...args),
    prefix
  });
}

// Rate limit global par IP
export const ipRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 req / 15 min / IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Trop de requêtes. Réessayez plus tard.'
  },
  store: createStore('rl:ip:') as any,
});

// Rate limit strict pour endpoints IA coûteux
export const aiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1, // 1 req/min par IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'AI_RATE_LIMIT',
    message: 'Génération IA limitée à 1 requête par minute.'
  },
  store: createStore('rl:ai:') as any,
});

// Générateur de rate limit par clé utilisateur (ex: userId ou API key)
export function userRateLimit(key: string, maxPerHourFree = 10, maxPerHourPro = 1000) {
  const isPro = false; // À brancher sur le plan utilisateur
  const max = isPro ? maxPerHourPro : maxPerHourFree;
  return rateLimit({
    windowMs: 60 * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: () => key,
    store: createStore('rl:user:') as any,
  });
}
