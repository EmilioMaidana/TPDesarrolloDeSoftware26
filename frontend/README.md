# Sweet Medical — Frontend

App Next.js 14 (App Router) + React 18 + Axios que consume la API de Sweet Medical.

## Desarrollo

```bash
npm install
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:3000/api
npm run dev -- -p 3001             # http://localhost:3001
```

> Corre en el puerto 3001 para no chocar con el backend (3000).

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Sirve el build |
| `npm run cypress:run` | Test E2E headless |
| `npm run cypress:open` | Test E2E interactivo |

## Estructura

```
src/
├── app/            # Pantallas (App Router): /, /buscar, /carrito, /mis-turnos,
│                   #   /notificaciones, /medico
├── components/     # Navbar, TurnoCard, Modal, Estados, UserSwitcher, Providers
├── context/        # SessionContext, CarritoContext, ToastContext
└── lib/            # api.js (cliente Axios) y format.js (moneda/fechas/badges)
```

La funcionalidad de **Búsqueda de turnos** está integrada de punta a punta con el
backend. El **carrito de preselección** vive solo en el cliente (localStorage).

Justificación de los requerimientos no funcionales: ver
[`../docs/RNF.md`](../docs/RNF.md).
