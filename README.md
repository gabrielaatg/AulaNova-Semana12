# Aula Nova — Aula virtual universitaria

Aplicación de demostración para estudiantes universitarios con perfil académico, cursos matriculados, calificaciones por evaluación y comunicación con docentes.

## Requisitos

- Node.js 18 o posterior (utiliza módulos nativos; no requiere dependencias adicionales).

## Ejecución

Desde la raíz del proyecto:

```powershell
npm start
```

Abre [http://localhost:3000](http://localhost:3000). Para cambiar el puerto, define `PORT` antes de iniciar el servidor.

## Estructura

- `app/`: interfaz web adaptable (HTML, CSS y JavaScript).
- `backend/`: servidor HTTP, API y pruebas automatizadas.

La API ofrece `GET /api/student`, `GET /api/courses`, `GET /api/messages` y `POST /api/messages`. El perfil, los cursos y las calificaciones son datos de demostración; los mensajes se mantienen en memoria mientras el servidor está activo.

## Pruebas

```powershell
npm install
npx playwright install chromium
npm run lint
npm run test:unit
npm run test:api
npm run test:e2e
npm run test:coverage
npm run report
```

Las herramientas se configuran desde el `package.json` raíz. Los archivos Jest y Playwright están en las carpetas numeradas. El servidor conserva HTTP nativo y se importa con `createServer()` para integración. El antiguo test integrado de Node.js se conserva con `npm run test:legacy`.

El proyecto configura `registry.npmmirror.com` en `.npmrc` porque el registro npm principal reinició la conexión durante la instalación en este entorno.

Para pruebas de rendimiento, instala k6 y mantén el servidor activo en otra terminal. Ejecuta uno de estos escenarios:

```powershell
npm run load:normal
npm run load:elevated
npm run load:stress
```

Puedes cambiar la URL del servidor con `$env:BASE_URL`. k6 debe estar instalado por separado del proyecto.
