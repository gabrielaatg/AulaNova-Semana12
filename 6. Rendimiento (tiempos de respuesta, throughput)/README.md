# Rendimiento — Aula Nova

## Objetivo
Evaluar el servidor con solicitudes a `GET /api/student`, `GET /api/courses` y `GET /api/messages`.

## Escenarios requeridos
- Carga normal: 10 usuarios virtuales durante 2 minutos.
- Carga elevada: 30 usuarios virtuales durante 3 minutos.
- Estrés: aumento progresivo hasta 100 usuarios virtuales durante aproximadamente 4 minutos.

## Métricas
Registrar tiempo de respuesta, p95, p99, throughput, tasa de errores y usuarios virtuales. Para carga normal, comparar con las referencias del PDF: p95 < 500 ms, p99 < 1000 ms y errores < 1 %.

## Evidencias
Guardar aquí el script k6 y los resultados de cada escenario con su análisis. Los resultados deben corresponder a ejecuciones reales.
