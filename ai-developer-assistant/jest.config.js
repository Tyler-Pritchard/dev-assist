module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-syntax-highlighter)/)',
  ],
  moduleNameMapper: {
    '^react-syntax-highlighter$': '<rootDir>/__mocks__/react-syntax-highlighter.js',
  },
};
