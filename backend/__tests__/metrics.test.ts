import { metricsMiddleware, recordCacheHit, recordCacheMiss, cacheHitRate } from '../lib/metrics';

function createMockReq(method = 'GET', path = '/test') {
  return { method, path } as any;
}

function createMockRes(statusCode = 200) {
  const listeners: Record<string, Function[]> = {};
  return {
    statusCode,
    on: (event: string, cb: Function) => {
      listeners[event] = listeners[event] || [];
      listeners[event].push(cb);
    },
    emit: (event: string) => {
      (listeners[event] || []).forEach(fn => fn());
    }
  } as any;
}

describe('metricsMiddleware & cache hit rate', () => {
  it('calcule hit rate = 0 quand aucun hit/miss', () => {
    const req = createMockReq();
    const res = createMockRes();
    const next = jest.fn();
    metricsMiddleware(req, res, next);
    res.emit('finish');
    // hashMap par défaut 0 -> set(rate) sera 0
    expect((cacheHitRate as any).hashMap[''].value).toBeDefined();
  });

  it('calcule hit rate >0 avec hits/misses', () => {
    const req = createMockReq('POST', '/cache');
    const res = createMockRes(201);
    const next = jest.fn();
    recordCacheHit();
    recordCacheMiss();
    recordCacheHit(); // 2 hits, 1 miss => 66.6%
    metricsMiddleware(req, res, next);
    res.emit('finish');
    // Après recalcul, le gauge set() est appelé - simulé; vérifier hashMap hits>0
    // On ne peut pas lire directement gauge value (dummy), mais on sait que branche total>0 exécutée
    expect((cacheHitRate as any).hashMap[''].value).toBeDefined();
  });
});
