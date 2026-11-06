"use strict";

(function exposeAulaNovaLogic(root) {
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);

  function validateMessage(payload) {
    if (!payload || !payload.courseId) return "Selecciona un curso.";
    const subject = typeof payload.subject === "string" ? payload.subject.trim() : "";
    const body = typeof payload.body === "string" ? payload.body.trim() : "";
    if (subject.length < 3 || subject.length > 100) return "El asunto debe tener entre 3 y 100 caracteres.";
    if (body.length < 5 || body.length > 1000) return "El mensaje debe tener entre 5 y 1000 caracteres.";
    return "";
  }

  const api = { escapeHtml, validateMessage };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.AulaNovaLogic = api;
})(typeof window !== "undefined" ? window : globalThis);
