"use strict";
const path = require("node:path");
const rootDir = path.resolve(__dirname, "..");
const junitReporter = require.resolve("jest-junit", { paths: [rootDir] });
module.exports = {
  rootDir,
  roots: ["<rootDir>/2. Integración_API (servidor Node.js)"],
  testEnvironment: "node",
  testMatch: ["**/*.test.js"],
  clearMocks: true,
  reporters: ["default", [junitReporter, {
    outputDirectory: "<rootDir>/2. Integración_API (servidor Node.js)/reports/junit",
    outputName: "jest-api.xml",
    addFileAttribute: "true"
  }]]
};
