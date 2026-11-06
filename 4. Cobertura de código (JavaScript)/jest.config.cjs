"use strict";
const path = require("node:path");
const rootDir = path.resolve(__dirname, "..");
const junitReporter = require.resolve("jest-junit", { paths: [rootDir] });
module.exports = {
  rootDir,
  roots: [
    "<rootDir>/1. Unitarias (cliente y servidor)",
    "<rootDir>/2. Integración_API (servidor Node.js)"
  ],
  testEnvironment: "node",
  testMatch: ["**/*.test.js"],
  collectCoverageFrom: [
    "backend/server.js", "backend/message-validation.js", "app/app.js", "app/logic.js",
    "!**/*.test.js", "!**/node_modules/**"
  ],
  coverageDirectory: "<rootDir>/4. Cobertura de código (JavaScript)/reports/coverage",
  coverageReporters: ["text", "html", "lcov", "cobertura", "json-summary"],
  coverageThreshold: {
    global: { statements: 80, branches: 70, functions: 80, lines: 80 }
  },
  reporters: ["default", [junitReporter, {
    outputDirectory: "<rootDir>/4. Cobertura de código (JavaScript)/reports/junit",
    outputName: "jest-all.xml"
  }]]
};
