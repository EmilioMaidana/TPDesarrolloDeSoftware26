# Justificación de Requerimientos No Funcionales (Entrega 3)

A continuación se detalla cómo el frontend cumple cada RNF pedido por la cátedra y
dónde se puede verificar en el código.

---

## 1. Interfaz intuitiva

- **Navegación coherente** con una barra superior fija (`components/Navbar.js`) que
  muestra siempre las secciones disponibles según el rol (paciente / médico) y
  resalta la sección activa (`aria-current="page"`).
- **Funcionalidades principales a pocos clics**: desde el home, elegir usuario →
  buscar → reservar son 3 pasos. El home (`app/page.js`) tiene un *hero* con un
  CTA claro ("Buscar turnos").
- Cada pantalla tiene un encabezado con título y una bajada que explica qué se
  puede hacer ahí (`page__head`).

## 2. Aprendizaje rápido (patrones de e-commerce)

- La **búsqueda** se comporta como un catálogo: barra de filtros arriba, grilla de
  resultados como "productos" (`TurnoCard`), y un **carrito de preselección** con
  contador en el menú y resumen con total (`app/carrito/page.js`).
- Botones con texto orientado a la acción ("Preseleccionar", "Reservar",
  "Reservar todos") y microcopys que guían el proceso (cobertura, monto a abonar,
  aclaración de "pendiente de confirmación").

## 3. Feedback visual y notificaciones

- **Skeletons** mientras cargan los resultados de la búsqueda
  (`components/Estados.js` → `SkeletonCards`) y **spinners** en cargas puntuales.
- **Toasts** de éxito/error en cada interacción relevante
  (`context/ToastContext.js`): reservar, cancelar, aceptar, dar de alta un servicio,
  generar disponibilidad, etc. Se anuncian con `role="status"` + `aria-live`.
- Estados de **botón deshabilitado + texto "Reservando…"/"Enviando…"** durante las
  llamadas para evitar doble envío.
- **Empty states** descriptivos cuando no hay datos (sin resultados, carrito vacío,
  sin turnos, sin notificaciones).
- Además, el sistema de **notificaciones in-app** propio del dominio se visualiza en
  `app/notificaciones/page.js` (no leídas / leídas / marcar como leída).

## 4. Diseño responsivo

- Layout fluido con `max-width` y grillas `auto-fill`/`auto-fit`
  (`grid--cards`, `filtros`) que se reacomodan en tablet y móvil.
- La barra de navegación colapsa en un **menú hamburguesa** en pantallas chicas
  (`@media (max-width: 760px)` en `globals.css`, con `aria-expanded`).
- Probado en anchos de desktop, tablet y móvil (las tarjetas pasan a 1 columna).

## 5. Accesibilidad

- **Foco visible** y consistente en todos los interactivos (`:focus-visible` con
  outline de alto contraste).
- **Etiquetas ARIA** y semántica: `aria-label` en navegación y botones de íconos,
  `role="dialog"` + `aria-modal` en el modal (`components/Modal.js`),
  `role="tablist"`/`aria-selected` en las pestañas, `aria-live` en avisos.
- **Navegación por teclado**: el modal se cierra con `Escape`; todos los controles
  son `<button>`/`<a>`/`<input>` nativos, navegables con Tab. Hay un **skip link**
  ("Saltar al contenido").
- Todos los `<input>`/`<select>` tienen su `<label>` asociado por `htmlFor`/`id`.
- **Contraste** y **tamaños**: paleta con contraste suficiente sobre fondo claro y
  botones con altura mínima de 42px (cómodos en táctil).

## 6. Consistencia de UI

- Un único **sistema de diseño** basado en variables CSS (`globals.css`): colores,
  tipografía, radios, sombras y espaciados centralizados.
- **Componentes reutilizables**: `TurnoCard`, `Modal`, `Estados` (skeleton/empty/
  spinner), `Navbar`, badges de cobertura y estados de turno con clases coherentes
  (`infoCobertura`, `claseEstado` en `lib/format.js`).
- Formato de moneda y fechas unificado en `lib/format.js` (`Intl.NumberFormat`
  es-AR), usado en todas las pantallas.

---

## Funcionalidad integrada con el backend

Según la consigna, la **Búsqueda de turnos** está integrada de punta a punta vía
Axios (`lib/api.js` → `app/buscar/page.js`): filtros (profesional, especialidad,
práctica, sede, rango de fechas), paginación, ordenamiento por costo/fecha
asc-desc, y cálculo de cobertura/monto por turno según el plan del paciente.

Para enriquecer la demo, también se integraron *Mis turnos*, *Notificaciones* y el
*Panel del médico* (agenda, servicios y disponibilidad), aunque la consigna solo
exigía la búsqueda integrada y el resto maquetado.

El **carrito de preselección** vive 100% en el cliente (Context + `localStorage`,
`context/CarritoContext.js`), sin persistencia en el backend.
