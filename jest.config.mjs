import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  // testURL: "http://localhost/", // for jsdom
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
  moduleNameMapper: {
    '^dexie$': "<rootDir>/node_modules/dexie",
    "^@/(.*)$": "<rootDir>/app/$1",
  },
  // https://www.npmjs.com/package/jest-localstorage-mock
  // "resetMocks": false,
  "setupFiles": [
    // "jest-localstorage-mock",
    "fake-indexeddb/auto", // shim indexeddb to test with Dexie
  ]
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
