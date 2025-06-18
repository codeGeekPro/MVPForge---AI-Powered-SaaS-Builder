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
  })),
}));

// Mock de Sequelize pour éviter les problèmes de SQLite
jest.mock('sequelize', () => {
  const mSequelize = {
    authenticate: jest.fn().mockResolvedValue(undefined),
    sync: jest.fn().mockResolvedValue(undefined),
    close: jest.fn().mockResolvedValue(undefined),
  };
  const actualSequelize = jest.requireActual('sequelize');
  return {
    ...actualSequelize,
    Sequelize: jest.fn(() => mSequelize),
  };
});

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
jest.mock('winston', () => ({
  createLogger: jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  })),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
}));

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
