"use strict";

// Consolida los reportes JUnit generados por Jest y Playwright en un HTML local.
const fs = require("node:fs");
const path = require("node:path");
const { XMLParser } = require("fast-xml-parser");
const root = path.resolve(__dirname, "..");
const reportDirs = [
  "1. Unitarias (cliente y servidor)/reports/junit",
  "2. Integración_API (servidor Node.js)/reports/junit",
  "3. End-to-End (E2E) en navegador/reports/junit"
];
const outputDir = path.join(__dirname, "reports");
const playwrightJson = path.join(root, "3. End-to-End (E2E) en navegador/reports/playwright.json");
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
const cases = [];

function visit(node, source) {
  if (!node || typeof node !== "object") return;
  for (const item of [].concat(node.testcase || [])) {
    cases.push({
      name: item.name || "(sin nombre)",
      suite: item.classname || source,
      failed: Boolean(item.failure || item.error),
      skipped: Boolean(item.skipped)
    });
  }
  for (const [key, value] of Object.entries(node)) {
    if (key === "testcase" || !value || typeof value !== "object") continue;
    for (const child of [].concat(value)) visit(child, source);
  }
}

for (const relativeDir of reportDirs) {
  const directory = path.join(root, relativeDir);
  if (!fs.existsSync(directory)) continue;
  for (const file of fs.readdirSync(directory).filter((name) => name.endsWith(".xml"))) {
    visit(parser.parse(fs.readFileSync(path.join(directory, file), "utf8")), file);
  }
}

fs.mkdirSync(outputDir, { recursive: true });
const total = cases.length;
const failed = cases.filter((item) => item.failed).length;
const skipped = cases.filter((item) => item.skipped).length;
const passed = total - failed - skipped;
let flaky = 0;
let e2eTotal = 0;
if (fs.existsSync(playwrightJson)) {
  try {
    const playwright = JSON.parse(fs.readFileSync(playwrightJson, "utf8"));
    flaky = Number(playwright.stats?.flaky || 0);
    e2eTotal = Number(playwright.stats?.expected || 0) + Number(playwright.stats?.unexpected || 0) + Number(playwright.stats?.skipped || 0) + flaky;
  } catch {
    console.warn("No se pudo leer playwright.json; Flaky % se mostrará como no disponible.");
  }
}
const passRate = total ? Number((passed / total * 100).toFixed(2)) : 0;
const flakyPercent = e2eTotal ? Number((flaky / e2eTotal * 100).toFixed(2)) : null;
const stabilityScore = total && flakyPercent !== null
  ? Number((Math.max(0, passed - flaky) / total * 100).toFixed(2))
  : null;
const historyPath = path.join(outputDir, "unireport-history.json");
let history = [];
if (fs.existsSync(historyPath)) {
  try { history = JSON.parse(fs.readFileSync(historyPath, "utf8")); } catch { history = []; }
}
history.push({ date: new Date().toISOString(), total, passed, failed, skipped, flaky,
  flakyPercent, stabilityScore, passRate });
history = history.slice(-30);
fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));

const esc = (value) => String(value).replace(/[&<>"']/g, (character) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const rows = cases.map((item) => `<tr><td>${item.failed ? "Fallida" : item.skipped ? "Omitida" : "Aprobada"}</td><td>${esc(item.suite)}</td><td>${esc(item.name)}</td></tr>`).join("");
const historyRows = history.map((run) => `<tr><td>${esc(run.date)}</td><td>${run.total}</td><td>${run.passed}</td><td>${run.failed}</td><td>${run.passRate}%</td><td>${run.stabilityScore == null ? "N/D" : `${run.stabilityScore}%`}</td><td>${run.flakyPercent == null ? "N/D" : `${run.flakyPercent}%`}</td></tr>`).join("");
const html = `<!doctype html><html lang="es"><meta charset="utf-8"><title>UniReport — Aula Nova</title><body><h1>UniReport — Aula Nova</h1><p>Total: ${total} | Aprobadas: ${passed} | Fallidas: ${failed} | Omitidas: ${skipped} | Pass rate: ${passRate}% | Stability Score: ${stabilityScore == null ? "N/D" : `${stabilityScore}%`} | Flaky: ${flakyPercent == null ? "N/D" : `${flakyPercent}%`}</p><p>Stability Score = (aprobadas − pruebas flaky) ÷ total × 100. Flaky % se calcula con la estadística de reintentos de Playwright.</p><h2>Casos de prueba</h2><table border="1"><thead><tr><th>Estado</th><th>Suite</th><th>Caso</th></tr></thead><tbody>${rows}</tbody></table><h2>Historial de ejecuciones del reporte</h2><table border="1"><thead><tr><th>Fecha</th><th>Total</th><th>Aprobadas</th><th>Fallidas</th><th>Pass rate</th><th>Stability Score</th><th>Flaky %</th></tr></thead><tbody>${historyRows}</tbody></table></body></html>`;
fs.writeFileSync(path.join(outputDir, "unireport.html"), html);
console.log(`UniReport generado: ${total} casos, ${passed} aprobados, ${failed} fallidos.`);
