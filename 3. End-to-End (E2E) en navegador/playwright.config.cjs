"use strict";
const path = require("node:path");
const { defineConfig } = require("@playwright/test");
const rootDir = path.resolve(__dirname, "..");
module.exports = defineConfig({
  testDir: __dirname,
  testMatch: "**/*.spec.js",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 1,
  reporter: [
    ["list"],
    ["junit", { outputFile: path.join(__dirname, "reports/junit/playwright.xml") }],
    ["json", { outputFile: path.join(__dirname, "reports/playwright.json") }],
    ["html", { outputFolder: path.join(__dirname, "reports/playwright-html"), open: "never" }]
  ],
  use: {
    baseURL: "http://127.0.0.1:3000",
    browserName: "chromium",
    headless: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  outputDir: path.join(__dirname, "reports/test-results"),
  webServer: {
    command: "node backend/server.js",
    cwd: rootDir,
    url: "http://127.0.0.1:3000/api/student",
    reuseExistingServer: !process.env.CI,
    timeout: 30000
  }
});
