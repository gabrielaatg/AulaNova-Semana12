# Pruebas unitarias — Aula Nova

## Objetivo
Probar de forma aislada la lógica del frontend y backend de Aula Nova.

## Alcance sugerido
- Frontend: escape de HTML, renderizado de cursos y mensajes, validación del formulario y navegación entre secciones.
- Backend: lectura de JSON y validaciones relacionadas con el envío de mensajes.
- Incluir escenarios positivos, negativos y casos límite; usar simulaciones para dependencias del DOM o solicitudes HTTP.

## Ejecución
Los comandos se agregarán al `package.json` raíz al configurar Jest. Ejecutar desde la raíz del proyecto.

## Evidencias
`aulanova.unit.test.js` contiene 15 casos de lógica de cliente y validación del backend. Los reportes se generan en `reports/junit`.
