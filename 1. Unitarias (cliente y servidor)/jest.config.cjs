"use strict";
const path = require("node:path");
const rootDir = path.resolve(__dirname, "..");
const junitReporter = require.resolve("jest-junit", { paths: [rootDir] });
module.exports = {
  rootDir,
  roots: ["<rootDir>/1. Unitarias (cliente y servidor)"],
  testEnvironment: "jsdom",
  testMatch: ["**/*.test.js"],
  clearMocks: true,
  reporters: ["default", [junitReporter, {
    outputDirectory: "<rootDir>/1. Unitarias (cliente y servidor)/reports/junit",
    outputName: "jest-unit.xml",
    addFileAttribute: "true"
  }]]
};
