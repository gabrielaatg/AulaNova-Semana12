"use strict";

const { escapeHtml, validateMessage } = require("../app/logic");
const { validateMessagePayload } = require("../backend/message-validation");

const courses = [{ id: "calc-201", name: "Cálculo diferencial" }];
const validPayload = { courseId: "calc-201", subject: "Consulta", body: "Necesito una orientación." };

describe("lógica del frontend", () => {
  test("escapa los cinco caracteres HTML especiales", () => {
    expect(escapeHtml(`&<>"'`)).toBe("&amp;&lt;&gt;&quot;&#39;");
  });
  test("conserva texto sin caracteres especiales", () => {
    expect(escapeHtml("Aula Nova 2026")).toBe("Aula Nova 2026");
  });
  test("convierte valores no textuales a cadena antes de escaparlos", () => {
    expect(escapeHtml(25)).toBe("25");
  });
  test("rechaza la selección de curso vacía", () => {
    expect(validateMessage({ ...validPayload, courseId: "" })).toMatch("Selecciona un curso");
  });
  test("rechaza un asunto compuesto solo por espacios", () => {
    expect(validateMessage({ ...validPayload, subject: "   " })).toMatch("asunto");
  });
  test("rechaza un asunto menor de tres caracteres", () => {
    expect(validateMessage({ ...validPayload, subject: "ab" })).toMatch("asunto");
  });
  test("acepta un asunto de exactamente tres caracteres", () => {
    expect(validateMessage({ ...validPayload, subject: "abc" })).toBe("");
  });
  test("rechaza un asunto mayor de cien caracteres", () => {
    expect(validateMessage({ ...validPayload, subject: "a".repeat(101) })).toMatch("asunto");
  });
  test("rechaza un mensaje vacío", () => {
    expect(validateMessage({ ...validPayload, body: "" })).toMatch("mensaje");
  });
  test("rechaza un mensaje menor de cinco caracteres", () => {
    expect(validateMessage({ ...validPayload, body: "abcd" })).toMatch("mensaje");
  });
  test("acepta un mensaje de exactamente cinco caracteres", () => {
    expect(validateMessage({ ...validPayload, body: "abcde" })).toBe("");
  });
  test("rechaza un mensaje mayor de mil caracteres", () => {
    expect(validateMessage({ ...validPayload, body: "x".repeat(1001) })).toMatch("mensaje");
  });
});

describe("validación del backend", () => {
  test("rechaza un payload nulo sin lanzar excepción", () => {
    expect(validateMessagePayload(null, courses).error).toBeTruthy();
  });
  test("rechaza un curso que no existe", () => {
    expect(validateMessagePayload({ ...validPayload, courseId: "no-existe" }, courses).error).toBeTruthy();
  });
  test("normaliza espacios y retorna el curso asociado", () => {
    expect(validateMessagePayload({ ...validPayload, subject: "  Consulta  ", body: "  Una pregunta válida.  " }, courses))
      .toEqual({ course: courses[0], subject: "Consulta", content: "Una pregunta válida." });
  });
});
