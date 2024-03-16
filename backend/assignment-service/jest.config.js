/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  resetMocks: true,
  testPathIgnorePatterns: ["src/tests/utils", "src/tests/payloads"],
};
