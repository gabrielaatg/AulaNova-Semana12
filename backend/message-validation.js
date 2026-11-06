"use strict";

function validateMessagePayload(payload, courses) {
  const data = payload && typeof payload === "object" && !Array.isArray(payload) ? payload : {};
  const course = courses.find((item) => item.id === data.courseId);
  const subject = typeof data.subject === "string" ? data.subject.trim() : "";
  const content = typeof data.body === "string" ? data.body.trim() : "";

  if (!course || subject.length < 3 || subject.length > 100 || content.length < 5 || content.length > 1000) {
    return { error: "Selecciona un curso e ingresa un asunto (3–100 caracteres) y un mensaje (5–1000 caracteres)." };
  }
  return { course, subject, content };
}

module.exports = { validateMessagePayload };
