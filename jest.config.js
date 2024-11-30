/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        isolatedModules: true, // Moved from `globals`
      },
    ],
  },
  testMatch: [
    "**/?(*.)+(spec|test|integration|e2e).[jt]s?(x)", // Matches all test types
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  clearMocks: true,
};
