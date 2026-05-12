/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.expo/'],
};



