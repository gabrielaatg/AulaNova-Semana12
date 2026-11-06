"use strict";

const request = require("supertest");
const { createServer } = require("../backend/server");

describe("API HTTP de Aula Nova", () => {
  let server;
  let api;

  beforeAll(async () => {
    server = createServer();
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    api = request(server);
  });

  afterAll(async () => {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  });

  test("GET /api/student devuelve 200 y el perfil del estudiante", async () => {
    const response = await api.get("/api/student").expect(200).expect("Content-Type", /json/);
    expect(response.body.student).toMatchObject({ code: "202310458", firstName: "María" });
    expect(response.body.student.email).toContain("@");
  });

  test("GET /api/courses devuelve cuatro cursos matriculados", async () => {
    const response = await api.get("/api/courses").expect(200);
    expect(response.body.courses).toHaveLength(4);
    expect(response.body.courses[0]).toHaveProperty("teacher");
  });

  test("los cursos contienen campos de horario, aula y créditos", async () => {
    const response = await api.get("/api/courses").expect(200);
    expect(response.body.courses[0]).toEqual(expect.objectContaining({ schedule: expect.any(String), room: expect.any(String), credits: expect.any(Number) }));
  });

  test("las calificaciones incluyen evaluaciones y nota final", async () => {
    const response = await api.get("/api/courses").expect(200);
    expect(response.body.courses[0].grades).toEqual(expect.objectContaining({ t1: expect.any(Number), t2: expect.any(Number), final: expect.any(Number) }));
  });

  test("GET /api/messages devuelve una lista", async () => {
    const response = await api.get("/api/messages").expect(200);
    expect(Array.isArray(response.body.messages)).toBe(true);
  });

  test("POST /api/messages registra un mensaje válido con estado 201", async () => {
    const response = await api.post("/api/messages").send({ courseId: "calc-201", subject: "  Consulta  ", body: "  ¿Cómo resuelvo el ejercicio?  " }).expect(201);
    expect(response.body.message).toMatchObject({ courseId: "calc-201", subject: "Consulta", teacher: "Dra. Elena Torres" });
    expect(response.body.message.body).toBe("¿Cómo resuelvo el ejercicio?");
  });

  test("el mensaje creado permanece visible en la bandeja durante la sesión", async () => {
    const response = await api.get("/api/messages").expect(200);
    expect(response.body.messages.some((message) => message.subject === "Consulta")).toBe(true);
  });

  test("POST /api/messages rechaza la ausencia de curso", async () => {
    const response = await api.post("/api/messages").send({ subject: "Consulta", body: "Texto suficiente" }).expect(400);
    expect(response.body.error).toBeTruthy();
  });

  test("POST /api/messages rechaza un asunto vacío", async () => {
    await api.post("/api/messages").send({ courseId: "calc-201", subject: "", body: "Texto suficiente" }).expect(400);
  });

  test("POST /api/messages rechaza un curso inexistente", async () => {
    await api.post("/api/messages").send({ courseId: "inexistente", subject: "Consulta", body: "Texto suficiente" }).expect(400);
  });

  test("POST /api/messages rechaza un mensaje de menos de cinco caracteres", async () => {
    await api.post("/api/messages").send({ courseId: "calc-201", subject: "Consulta", body: "1234" }).expect(400);
  });

  test("POST /api/messages rechaza JSON mal formado", async () => {
    const response = await api.post("/api/messages").set("Content-Type", "application/json").send("{").expect(400);
    expect(response.body.error).toMatch(/JSON/i);
  });

  test("POST /api/messages rechaza cuerpos mayores al máximo con 413", async () => {
    const response = await api.post("/api/messages").send({ body: "x".repeat(17 * 1024) }).expect(413);
    expect(response.body.error).toMatch(/tamaño permitido/i);
  });

  test("una ruta de API inexistente devuelve 404", async () => {
    const response = await api.get("/api/no-existe").expect(404);
    expect(response.body.error).toMatch(/Ruta no encontrada/i);
  });

  test("un archivo estático inexistente devuelve 404", async () => {
    await api.get("/no-existe.css").expect(404);
  });

  test("el servidor deniega el acceso a archivos fuera de app con 403", async () => {
    const response = await api.get("/..%2Fbackend%2Fserver.js").expect(403);
    expect(response.body.error).toMatch(/Acceso denegado/i);
  });
});
