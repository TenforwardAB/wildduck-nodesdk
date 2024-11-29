/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  testMatch: [
    "**/?(*.)+(spec|test|integration|e2e).[jt]s?(x)", // Inkluderar spec, test, integration och e2e
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  clearMocks: true,
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
};
