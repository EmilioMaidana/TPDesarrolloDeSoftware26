# Sweet Medical 🩺

Plataforma web de gestión de turnos médicos. Los profesionales definen su
disponibilidad y los servicios que ofrecen; los pacientes buscan turnos según su
obra social y plan, ven cuánto van a pagar según su cobertura y reservan.

Trabajo Práctico Integrador — Desarrollo de Software (UTN), 1C 2026.

---

## Tabla de contenidos

- [Stack](#stack)
- [Arquitectura](#arquitectura)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Requisitos previos](#requisitos-previos)
- [Puesta en marcha (local)](#puesta-en-marcha-local)
- [Variables de entorno](#variables-de-entorno)
- [Documentación de la API (Swagger)](#documentación-de-la-api-swagger)
- [Tests](#tests)
- [Git flow](#git-flow)
- [Despliegue](#despliegue)
- [Otros documentos](#otros-documentos)

---

## Stack

| Capa | Tecnologías |
|------|-------------|
| Backend | Node.js · Express 5 · Mongoose · MongoDB · Swagger (swagger-jsdoc + swagger-ui-express) · node-cron |
| Frontend | Next.js 14 (App Router) · React 18 · Axios |
| Testing | Jest (unitarios + integración) · Supertest · Cypress (E2E) |
| Deploy | Render (backend) · Netlify (frontend) |

---

## Arquitectura

El backend sigue una arquitectura por capas con inyección de dependencias manual
(armada en `app.js`):

```
HTTP  ──>  routes  ──>  controllers  ──>  services  ──>  repositories  ──>  Mongoose models
                                            │
                                            └──>  domain (lógica de negocio pura)
```

- **domain/**: clases del modelo de objetos (el Diagrama de Clases de la cátedra).
  Acá vive la lógica de negocio "pura" (estados de un turno, cálculo de cobertura,
  generación de slots de la agenda, fábrica de notificaciones). Estas clases se
  enchufan a Mongoose con `schema.loadClass(...)`.
- **service/**: orquesta casos de uso, coordina repositorios y dominio.
- **controllers/**: adaptan HTTP <-> servicios (leen `req`, responden `res`).
- **repositories/**: acceso a datos (Mongoose).
- **schemas/**: esquemas de Mongoose. `schemas/registerModels.js` importa todos
  los modelos para que estén registrados antes de cualquier `.populate()`.

El frontend (`frontend/`) es una app Next.js independiente que consume la API por
HTTP con Axios.

---

## Estructura del repositorio

```
.
├── app.js                 # App de Express + wiring de dependencias
├── server.js              # Arranque del server (conexión a Mongo + listen)
├── seed_full.js           # Carga datos de ejemplo en la base
├── batch/                 # Procesos batch (generación de turnos, recordatorios)
├── config/                # Conexión a Mongo y configuración de Swagger
├── controllers/ service/ repositories/ domain/ schemas/ routes/ middlewares/ errors/
├── tests/
│   ├── domain/  service/  # Tests unitarios (Entrega 2)
│   └── integration/       # Test de integración de controladores (Entrega 4)
├── frontend/              # App Next.js (Entrega 3/4)
│   ├── src/app/           # Pantallas (App Router)
│   ├── src/components/  src/context/  src/lib/
│   └── cypress/           # Test E2E (Entrega 4)
└── docs/                  # Despliegue, RNF y guía de pruebas
```

---

## Requisitos previos

- **Node.js** 18 o superior.
- **MongoDB** 6+ corriendo localmente. Este proyecto usa el puerto **27018** y la
  base **SweetMedical** (ver `.env`).

Para levantar Mongo en el puerto 27018 con una carpeta de datos local:

```bash
mongod --dbpath ./db_data --port 27018
```

> También podés usar una instancia de Mongo en Docker o un cluster de MongoDB
> Atlas; solo ajustá `MONGODB_URI` en tu `.env`.

---

## Puesta en marcha (local)

### 1) Backend

```bash
# desde la raíz del repo
cp .env.example .env          # y revisá los valores
npm install
npm run seed                  # carga datos de ejemplo (médicos, pacientes, planes…)
npm run batch                 # genera turnos DISPONIBLE para los próximos días
npm run dev                   # levanta la API en http://localhost:3000
```

- Health check: http://localhost:3000/api/health
- Swagger: http://localhost:3000/api-docs

### 2) Frontend

```bash
cd frontend
cp .env.local.example .env.local   # apunta a http://localhost:3000/api
npm install
npm run dev -- -p 3001             # http://localhost:3001
```

Abrí http://localhost:3001, elegí un usuario (por ejemplo el paciente **Juan
Domínguez** o el médico **Dr. Carlos Gómez**) y empezá a operar.

> El frontend corre en el puerto **3001** para no chocar con el backend (3000).

---

## Variables de entorno

Backend (`.env`, ver `.env.example`):

| Variable | Default | Descripción |
|----------|---------|-------------|
| `MONGODB_URI` | `mongodb://127.0.0.1:27018` | URI de Mongo (sin la base) |
| `MONGODB_DB_NAME` | `SweetMedical` | Nombre de la base |
| `PORT` | `3000` | Puerto HTTP |
| `HOST` | `0.0.0.0` | Interfaz de escucha |
| `BATCH_DAYS_AHEAD` | `14` | Días a futuro que genera el batch |
| `PUBLIC_URL` | — | URL pública para Swagger en prod |
| `MONGODB_TEST_URI` | `…/SweetMedical_inttest` | Base para los tests de integración |

Frontend (`frontend/.env.local`, ver `frontend/.env.local.example`):

| Variable | Default | Descripción |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000/api` | URL base de la API |

---

## Documentación de la API (Swagger)

Con el backend levantado, la documentación interactiva está en
**http://localhost:3000/api-docs**. Endpoints principales:

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/turnos/disponibles` | Búsqueda de turnos (filtros, paginación, orden, cotización) |
| POST | `/api/turnos/:id/reservar` | Reservar (paciente) |
| POST | `/api/turnos/:id/aceptar` | Aceptar reserva (médico) → notifica al paciente |
| POST | `/api/turnos/:id/cancelar` | Cancelar (paciente o médico, con motivo) |
| PATCH | `/api/turnos/:id/reprogramar` | Proponer cambio de fecha |
| PATCH | `/api/turnos/:id/confirmar-reprogramacion` | Confirmar cambio de fecha |
| PATCH | `/api/turnos/:id/realizado` | Marcar realizado (médico) |
| GET | `/api/medicos/:medicoId/turnos` | Agenda del médico (`?estado=`, `?pacienteId=`) |
| GET | `/api/pacientes/:pacienteId/turnos` | Historial de turnos del paciente |
| GET/POST/PUT | `/api/medicos/:id/disponibilidad` | Gestión de disponibilidad |
| GET/POST/DELETE | `/api/medicos/:id/servicios` | Servicios del médico |
| GET/POST/PUT/DELETE | `/api/servicios/especialidades`, `/api/servicios/practicas` | ABM de servicios |
| GET | `/api/notificaciones/no-leidas/:usuarioId`, `/leidas/:usuarioId` | Notificaciones |
| PATCH | `/api/notificaciones/:id/leer` | Marcar notificación como leída |
| GET | `/api/medicos`, `/api/pacientes`, `/api/sedes` | Catálogos de apoyo |

---

## Tests

```bash
# Backend — unitarios (dominio + servicios). No necesitan Mongo.
npm test

# Backend — integración de controladores (necesita Mongo levantado).
npm run test:integration

# Frontend — E2E con Cypress.
# Requiere backend (3000) + frontend (3001) corriendo y base seedeada.
cd frontend
npm run cypress:run     # headless
npm run cypress:open    # interactivo
```

Detalle completo y pasos reproducibles en [docs/PRUEBAS.md](docs/PRUEBAS.md).

---

## Git flow

El equipo trabaja con un flujo basado en **feature branches** sobre `main`:

- **`main`**: rama estable y desplegable. No se commitea directo.
- **`feature/<descripcion>`**: una rama por funcionalidad o fix, sale de `main`.
- Al terminar, se abre un **Pull Request** hacia `main`. El PR requiere que los
  tests pasen en verde antes de mergear (squash & merge).
- Cada entrega del TP quedó además etiquetada en su propia rama
  (`terceraEntrega`, etc.) como hito.

Convención de commits: mensajes cortos y descriptivos en imperativo
(ej.: `agrega endpoint de agenda del médico`, `corrige cálculo de cobertura`).

---

## Despliegue

Backend en Render y frontend en Netlify. Pasos detallados (primer deploy y cada
release) en [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md).

---

## Otros documentos

- [docs/PRUEBAS.md](docs/PRUEBAS.md) — guía paso a paso para probar todo el sistema.
- [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md) — despliegue en la nube.
- [docs/RNF.md](docs/RNF.md) — justificación de los requerimientos no funcionales (Entrega 3).
