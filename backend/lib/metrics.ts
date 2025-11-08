import client, { Counter, Gauge, Histogram, Registry } from 'prom-client';

// Registre Prometheus
export const register: Registry = new client.Registry();
// Labels par défaut pour toutes les métriques
register.setDefaultLabels({ app: 'mvpforge', env: process.env.NODE_ENV || 'development' });
client.collectDefaultMetrics({ register });

// Compteurs
export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'] as const,
});

export const httpResponsesTotal = new Counter({
  name: 'http_responses_total',
  help: 'Total HTTP responses',
  labelNames: ['method', 'route', 'status'] as const,
});

// Histogramme temps de réponse
export const httpResponseTime = new Histogram({
  name: 'http_response_time_ms',
  help: 'HTTP response time in ms',
  labelNames: ['method', 'route', 'status'] as const,
  buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500],
});

// Cache gauges/counters
export const cacheHitsTotal = new Counter({
  name: 'cache_hits_total',
  help: 'Total cache hits',
});
export const cacheMissesTotal = new Counter({
  name: 'cache_misses_total',
  help: 'Total cache misses',
});
export const cacheHitRate = new Gauge({
  name: 'cache_hit_rate',
  help: 'Cache hit rate percentage',
});

register.registerMetric(httpRequestsTotal);
register.registerMetric(httpResponsesTotal);
register.registerMetric(httpResponseTime);
register.registerMetric(cacheHitsTotal);
register.registerMetric(cacheMissesTotal);
register.registerMetric(cacheHitRate);

export function metricsMiddleware(req: any, res: any, next: any) {
  const start = process.hrtime.bigint();
  const route = req.route?.path || req.path || 'unknown';
  httpRequestsTotal.inc({ method: req.method, route, status: 'pending' });
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const ms = Number(end - start) / 1_000_000; // ns -> ms
    const status = String(res.statusCode);
    httpResponsesTotal.inc({ method: req.method, route, status });
    httpResponseTime.observe({ method: req.method, route, status }, ms);

    // recalcul simple du taux de hit cache (si utilisé)
    const hits = (cacheHitsTotal as any).hashMap?.['']?.value || 0;
    const misses = (cacheMissesTotal as any).hashMap?.['']?.value || 0;
    const total = hits + misses;
    const rate = total ? (hits / total) * 100 : 0;
    cacheHitRate.set(rate);
  });
  next();
}

export function recordCacheHit() { cacheHitsTotal.inc(); }
export function recordCacheMiss() { cacheMissesTotal.inc(); }

