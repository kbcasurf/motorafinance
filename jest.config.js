/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    'expo-file-system/legacy': '<rootDir>/src/__mocks__/expo-file-system.ts',
    'expo-file-system': '<rootDir>/src/__mocks__/expo-file-system.ts',
    'expo-sharing': '<rootDir>/src/__mocks__/expo-sharing.ts',
  },
};

module.exports = config;
