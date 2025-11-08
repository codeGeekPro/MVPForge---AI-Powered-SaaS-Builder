// Configuration Jest pour les tests backend
// import { jest } from '@jest/globals'; // Not needed, jest is available globally

// Mock des variables d'environnement
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.OPENAI_API_KEY = 'test-key';

// Mock de la base de données pour les tests
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $queryRaw: jest.fn().mockResolvedValue(1),
    mvp: {
      count: jest.fn().mockResolvedValue(0),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
      create: jest.fn().mockImplementation(({ data }: any) => ({ id: 'mvp1', createdAt: new Date().toISOString(), ...data })),
      findMany: jest.fn().mockResolvedValue([])
    },
    user: {
      count: jest.fn().mockResolvedValue(0),
      findUnique: jest.fn().mockResolvedValue({ id: 'user1', email: 'demo@mvpforge.com' }),
      create: jest.fn().mockImplementation(({ data }: any) => ({ id: 'user1', ...data }))
    },
  })),
}));

// Mock de Sequelize pour éviter les problèmes de SQLite
// Plus de Sequelize (mono-ORM Prisma)

// Mock du FreeAPIManager
jest.mock('./free-api-manager', () => ({
  FreeAPIManager: jest.fn().mockImplementation(() => ({
    generateWithFallback: jest.fn().mockResolvedValue('Mocked AI response'),
    validateEmail: jest.fn().mockResolvedValue({ is_valid: true, score: 0.9 }),
    getNews: jest.fn().mockResolvedValue([]),
  })),
}));

// Mock d'OpenAI pour les tests
jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'Test response' } }],
        }),
      },
    },
  })),
}));

// Mock de winston pour les logs
// Mock de Sentry & Pino pour les tests
jest.mock('@sentry/node', () => ({
  init: jest.fn(),
  captureException: jest.fn().mockReturnValue('test-error-id'),
}));

jest.mock('@sentry/profiling-node', () => ({
  nodeProfilingIntegration: jest.fn(() => ({})),
}));

jest.mock('pino', () => {
  const fakeLogger = { info: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() };
  const pino = jest.fn(() => fakeLogger);
  return pino;
});

// Mock prom-client
jest.mock('prom-client', () => {
  class DummyMetric {
    public config: any;
    public hashMap: Record<string, { value: number }>;
    constructor(config: any) {
      this.config = config;
      // Simule le stockage interne utilisé par prom-client pour .metrics()
      this.hashMap = { '': { value: 0 } };
    }
    inc() { this.hashMap[''].value += 1; }
    observe(_labels?: any, _value?: number) {}
    set(_value?: number) {}
  }
  class MockRegistry {
    contentType = 'text/plain; version=0.0.4; charset=utf-8';
    registerMetric = jest.fn();
    metrics = jest.fn().mockResolvedValue('http_requests_total 0\n');
    setDefaultLabels = jest.fn();
  }
  const defaultExport = {
    Registry: MockRegistry,
    collectDefaultMetrics: jest.fn(),
  };
  return {
    Counter: DummyMetric,
    Gauge: DummyMetric,
    Histogram: DummyMetric,
    Registry: MockRegistry,
    collectDefaultMetrics: jest.fn(),
    default: defaultExport,
  };
});

// Mock de express-rate-limit
jest.mock('express-rate-limit', () => {
  return jest.fn(() => (req: any, res: any, next: any) => next());
});

// Mock de archiver
jest.mock('archiver', () => {
  return jest.fn(() => ({
    pipe: jest.fn().mockReturnThis(),
    append: jest.fn().mockReturnThis(),
    finalize: jest.fn().mockResolvedValue(undefined),
  }));
});
