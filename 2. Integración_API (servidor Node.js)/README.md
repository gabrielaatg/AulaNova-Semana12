# Pruebas de integración — API de Aula Nova

## Objetivo
Comprobar la interacción HTTP con los endpoints del servidor mediante Supertest.

## Endpoints a cubrir
- `GET /api/student`
- `GET /api/courses`
- `GET /api/messages`
- `POST /api/messages`

Verificar respuestas exitosas, validaciones, persistencia temporal de mensajes, JSON inválido, solicitudes grandes, rutas inexistentes y acceso denegado a recursos fuera de la aplicación.

## Ejecución
Se configurará un comando de npm para ejecutar estas pruebas desde la raíz del proyecto. El servidor se creará mediante `createServer()`.

## Evidencias
`aulanova.api.test.js` contiene casos de éxito, validación, persistencia temporal, JSON mal formado, límites de tamaño y protección de rutas. El reporte JUnit se genera en `reports/junit`.
