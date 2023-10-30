module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.(tsx?|hehehe)$': [
      'ts-jest',
      {
        isolatedModules: true,
        resolveJsonModules: true,
      },
    ],
  },
  testMatch: ['<rootDir>/src/**/*.spec.{js,jsx,ts,tsx}'],
  collectCoverage: true,
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/index.ts',
    '!src/@types/**/*',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
