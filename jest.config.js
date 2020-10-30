/**
 * Via either an Environment Variable or different config that is set we will do testing on Boilerplate and Integration
 */
module.exports = {
  testMatch: [
    "<rootDir>/src/**/*.test.{js,ts}",
    "<rootDir>/test/**/*.test.{js,ts}",
    "<rootDir>/boilerplate/app/state/**/*.test.{js,ts}",
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx,js,jsx}",
    "!**/node_modules/**",
    "!**/coverage/**",
    "!**/dist/**",
  ],
  testPathIgnorePatterns: ["/test/generators-integration.test.ts", "/node_modules"],
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  coverageThreshold: {
    global: {
      statements: 36,
      branches: 27,
      functions: 41,
      lines: 36,
    },
  },
  clearMocks: true,
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
}
