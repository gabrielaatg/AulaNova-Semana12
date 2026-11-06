"use strict";
const js = require("@eslint/js");
const globals = require("globals");
module.exports = [
  { ignores: ["**/node_modules/**", "**/reports/**", "**/coverage/**", "**/playwright-report/**", "**/test-results/**"] },
  js.configs.recommended,
  {
    files: ["backend/**/*.js", "**/*.cjs", "1. Unitarias (cliente y servidor)/**/*.js", "2. Integración_API (servidor Node.js)/**/*.js", "3. End-to-End (E2E) en navegador/**/*.js"],
    languageOptions: { globals: { ...globals.node, ...globals.jest }, ecmaVersion: "latest" },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
      eqeqeq: "error",
      "no-eval": "error",
      complexity: ["warn", { max: 10 }],
      "max-lines-per-function": ["warn", { max: 50, skipBlankLines: true, skipComments: true }]
    }
  },
  {
    files: ["app/**/*.js"],
    languageOptions: { globals: globals.browser, ecmaVersion: "latest", sourceType: "script" },
    rules: {
      "no-unused-vars": "error", "no-undef": "error", eqeqeq: "error", "no-eval": "error",
      complexity: ["warn", { max: 10 }],
      "max-lines-per-function": ["warn", { max: 50, skipBlankLines: true, skipComments: true }]
    }
  },
  {
    files: ["app/logic.js"],
    languageOptions: { globals: { module: "readonly" } }
  },
  { files: ["6. Rendimiento (tiempos de respuesta, throughput)/**/*.js"], languageOptions: { globals: { __ENV: "readonly" }, sourceType: "module" } }
];
