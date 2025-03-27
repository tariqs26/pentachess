// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": ["babel-jest", { configFile: './babel.config.cjs' }]
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["**/*.test.js", "**/*.test.ts"],
  collectCoverageFrom: ["src/**/*.{js,ts}", "!src/**/*.d.ts"],
  transformIgnorePatterns: [
    "/node_modules/(?!(@jest)/)"
  ]
}
