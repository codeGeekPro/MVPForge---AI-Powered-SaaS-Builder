module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: [
    '**/__tests__/**/*.(test|spec).ts',
    '**/*.(test|spec).ts'
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text','lcov'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: [
    'lib/metrics.ts',
    'auth.ts'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!uuid)',
  ],
}
