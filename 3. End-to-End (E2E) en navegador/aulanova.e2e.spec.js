"use strict";

const { test, expect } = require("@playwright/test");

test("E2E01: la página principal muestra el dashboard de Aula Nova", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /hola, maría/i })).toBeVisible();
  await expect(page.getByText("Cursos matriculados")).toBeVisible();
});

test("E2E02: el perfil presenta los datos del estudiante", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-view="perfil"]').click();
  await expect(page.locator("#view-perfil")).toBeVisible();
  await expect(page.locator("#profile-name")).toHaveText("María García López");
  await expect(page.locator("#profile-code")).toHaveText("202310458");
});

test("E2E03: Mis cursos muestra los cuatro cursos", async ({ page }) => {
  await page.goto("/");
  await page.locator('.nav-link[data-view="cursos"]').click();
  await expect(page.locator("#view-cursos")).toBeVisible();
  await expect(page.locator("#all-courses .course-tile")).toHaveCount(4);
});

test("E2E04: Calificaciones muestra una fila por curso", async ({ page }) => {
  await page.goto("/");
  await page.locator('.nav-link[data-view="notas"]').click();
  await expect(page.locator("#view-notas")).toBeVisible();
  await expect(page.locator("#grades-body tr")).toHaveCount(4);
  await expect(page.getByRole("heading", { name: "Detalle de calificaciones" })).toBeVisible();
});

test("E2E05: la sección Mensajes presenta la bandeja", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-view="mensajes"]').click();
  await expect(page.locator("#view-mensajes")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Mis mensajes" })).toBeVisible();
  await expect(page.locator("#messages-list")).not.toBeEmpty();
});

test("E2E06: el botón Nuevo mensaje abre el diálogo", async ({ page }) => {
  await page.goto("/#mensajes");
  await page.getByRole("button", { name: /nuevo mensaje/i }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Escribe a tu profesor" })).toBeVisible();
});

test("E2E07: un mensaje válido se envía y aparece en la bandeja", async ({ page }) => {
  await page.goto("/#mensajes");
  await page.getByRole("button", { name: /nuevo mensaje/i }).click();
  await page.locator("#message-course").selectOption("calc-201");
  await page.locator("#message-subject").fill("Consulta E2E automática");
  await page.locator("#message-body").fill("Quisiera consultar el contenido de la práctica.");
  const responsePromise = page.waitForResponse((response) => response.url().endsWith("/api/messages") && response.request().method() === "POST");
  await page.locator("#send-message").click();
  expect((await responsePromise).status()).toBe(201);
  await expect(page.locator("#message-dialog")).not.toBeVisible();
  await expect(page.locator("#messages-list")).toContainText("Consulta E2E automática");
  await expect(page.getByRole("status")).toContainText("Mensaje enviado correctamente");
});

test("E2E08: el formulario informa que falta seleccionar curso", async ({ page }) => {
  await page.goto("/#mensajes");
  await page.getByRole("button", { name: /nuevo mensaje/i }).click();
  await page.locator("#send-message").click();
  await expect(page.locator("#form-feedback")).toContainText("Selecciona un curso");
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("E2E09: se puede navegar por todas las secciones", async ({ page }) => {
  await page.goto("/");
  for (const view of ["cursos", "notas", "mensajes", "perfil", "inicio"]) {
    await page.locator(`[data-view="${view}"]`).first().click();
    await expect(page.locator(`#view-${view}`)).toBeVisible();
    await expect(page.locator("#breadcrumb-current")).not.toBeEmpty();
  }
});

test("E2E10: recargar vuelve a cargar el perfil y los cursos", async ({ page }) => {
  await page.goto("/#cursos");
  await expect(page.locator("#all-courses .course-tile")).toHaveCount(4);
  await page.reload();
  await expect(page.locator("#profile-code")).toHaveText("202310458");
  await page.locator('.nav-link[data-view="cursos"]').click();
  await expect(page.locator("#all-courses .course-tile")).toHaveCount(4);
});
