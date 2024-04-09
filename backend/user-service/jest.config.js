module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["tests/utils", "tests/payloads", "dist"],
};
