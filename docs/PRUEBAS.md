# Guía de pruebas — Sweet Medical

Esta guía permite **probar el proyecto completo** de punta a punta: levantar el
entorno, correr los tests automáticos y verificar manualmente cada requerimiento
funcional (por API y por la interfaz).

---

## 1. Levantar el entorno

### 1.1 MongoDB

```bash
mongod --dbpath ./db_data --port 27018
```

> Dejar esta terminal abierta. Verificar con cualquier cliente (Compass) que la
> base responde en `mongodb://127.0.0.1:27018`.

### 1.2 Backend + datos de ejemplo

```bash
# raíz del repo
npm install
npm run seed     # carga médicos, pacientes, planes, especialidades, prácticas…
npm run batch    # genera ~80 turnos DISPONIBLE para los próximos 14 días
npm run dev      # API en http://localhost:3000
```

### 1.3 Frontend

```bash
cd frontend
npm install
npm run dev -- -p 3001    # http://localhost:3001
```

---

## 2. Datos de ejemplo que carga el seed

**Usuarios** (password `123` en todos):

| Usuario | Rol | Nombre |
|---------|-----|--------|
| `paciente.juan` | Paciente | Juan Domínguez — Plan **210** |
| `paciente.maria` | Paciente | María López — Plan **410 Premium** |
| `dr.gomez` | Médico | Dr. Carlos Gómez |
| `dra.perez` | Médico | Dra. Ana Pérez |

**Coberturas (resumen):**

| Servicio | Costo base | Plan 210 (Juan) | Plan 410 (María) |
|----------|-----------:|-----------------|------------------|
| Cardiología | $30.000 | 80% → paga **$6.000** | 100% → paga **$0** |
| Dermatología | $25.000 | no cubierta → paga **$25.000** | 100% → paga **$0** |
| Pediatría | $20.000 | 100% → paga **$0** | 100% → paga **$0** |
| Electrocardiograma | $10.000 | 100% → paga **$0** | 100% → paga **$0** |
| Biopsia de piel | $35.000 | no cubierta → paga **$35.000** | 80% → paga **$7.000** |

**Médicos / disponibilidad:**

- **Dr. Carlos Gómez** — Sede Central. Cardiología (Lun 09–13), Electrocardiograma (Mié 14–18).
- **Dra. Ana Pérez** — Sede Norte. Dermatología (Mar 10–14), Pediatría (Jue 09–12).

> Los `_id` cambian en cada `seed`. Para obtenerlos: `GET /api/pacientes`,
> `GET /api/medicos`, o simplemente usá la interfaz (el selector de usuario ya
> resuelve los IDs por vos).

---

## 3. Tests automáticos

```bash
# Unitarios (dominio + servicios) — Entrega 2. No necesitan Mongo.
npm test                  # 36 tests

# Integración de controladores — Entrega 4. Necesita Mongo levantado.
npm run test:integration  # 3 tests (usa la base SweetMedical_inttest, que borra al terminar)

# E2E del frontend — Entrega 4. Backend (3000) + frontend (3001) levantados y seedeados.
cd frontend
npm run cypress:run       # flujo de búsqueda + preselección
```

Resultado esperado: **todo en verde**.

---

## 4. Pruebas manuales por API

Se pueden hacer desde **Swagger** (http://localhost:3000/api-docs) o con `curl`.
Primero, conseguir un `pacienteId` y un `medicoId`:

```bash
curl -s http://localhost:3000/api/pacientes
curl -s http://localhost:3000/api/medicos
```

Guardá los IDs en variables (ejemplo de un shell tipo bash):

```bash
PAC=<id_de_juan>
MED=<id_de_gomez>
PACUSR=<usuario_de_juan>   # campo "usuario" del paciente
```

### 4.1 Health check

```bash
curl -s http://localhost:3000/api/health
# => {"status":"ok","timestamp":"..."}
```

### 4.2 Búsqueda de turnos (filtros, orden, paginación, cobertura)

```bash
# Ordenado por costo ascendente, 5 por página
curl -s "http://localhost:3000/api/turnos/disponibles?pacienteId=$PAC&sortBy=costo&order=asc&limit=5"

# Filtrando por médico y especialidad
curl -s "http://localhost:3000/api/turnos/disponibles?pacienteId=$PAC&medicoId=$MED&page=1&limit=10"
```

Verificar en la respuesta: `paginacion` (page/limit/total/totalPages) y, en cada
turno, `cotizacion` con `nivelCobertura`, `porcentajeCobertura` y `costoFinal`.

### 4.3 Reservar → aceptar → notificación

```bash
# Tomar un turno disponible de cardiología de Gómez
TURNO=$(curl -s "http://localhost:3000/api/turnos/disponibles?pacienteId=$PAC&medicoId=$MED&especialidadId=<id_cardio>&limit=1" | python -c "import sys,json;print(json.load(sys.stdin)['turnos'][0]['_id'])")

# Reservar (paciente) -> RESERVADO, notifica al médico
curl -s -X POST "http://localhost:3000/api/turnos/$TURNO/reservar?pacienteId=$PAC"

# Aceptar (médico) -> CONFIRMADO, notifica al paciente
curl -s -X POST "http://localhost:3000/api/turnos/$TURNO/aceptar?medicoId=$MED"

# Notificaciones del paciente
curl -s "http://localhost:3000/api/notificaciones/no-leidas/$PACUSR"
```

### 4.4 Cancelar con motivo (validación de 1 hora)

```bash
curl -s -X POST "http://localhost:3000/api/turnos/$TURNO/cancelar?usuarioId=$PACUSR" \
  -H "Content-Type: application/json" -d '{"motivo":"Surgió un imprevisto"}'
```

Verificar que cancelar **sin motivo** devuelve 400 y que un turno a menos de 1h no
se puede cancelar.

### 4.5 Reprogramación con confirmación

```bash
# Proponer (deja el turno PENDIENTE_CONFIRMACION)
curl -s -X PATCH "http://localhost:3000/api/turnos/$TURNO/reprogramar?usuarioId=$PACUSR" \
  -H "Content-Type: application/json" -d '{"nuevaFecha":"2026-07-01T10:00:00.000Z"}'

# Confirmar
curl -s -X PATCH "http://localhost:3000/api/turnos/$TURNO/confirmar-reprogramacion?usuarioId=$PACUSR"
```

### 4.6 Disponibilidad y regeneración de turnos

```bash
# Consultar disponibilidad del médico
curl -s "http://localhost:3000/api/medicos/$MED/disponibilidad"

# Crear una nueva disponibilidad (genera turnos DISPONIBLE automáticamente)
curl -s -X POST "http://localhost:3000/api/medicos/$MED/disponibilidad" \
  -H "Content-Type: application/json" \
  -d '{"diaSemana":"VIERNES","horaDesde":"09:00","horaHasta":"11:00","servicio":"<id_cardio>","servicioTipo":"Especialidad","sede":{"nombre":"Sede Central","direccion":"Av. Corrientes 1234"}}'
```

> Regla a verificar: al actualizar disponibilidad, **no** se tocan turnos pasados
> ni los **RESERVADOS** futuros; solo se regeneran los **DISPONIBLE** futuros.

### 4.7 Gestión de servicios (alta / baja)

```bash
curl -s "http://localhost:3000/api/medicos/$MED/servicios"
curl -s -X POST "http://localhost:3000/api/medicos/$MED/servicios" \
  -H "Content-Type: application/json" -d '{"tipo":"Especialidad","servicioId":"<id_pediatria>"}'
curl -s -X DELETE "http://localhost:3000/api/medicos/$MED/servicios/<id_pediatria>?tipo=Especialidad"
```

### 4.8 Notificaciones

```bash
curl -s "http://localhost:3000/api/notificaciones/no-leidas/$PACUSR"
curl -s "http://localhost:3000/api/notificaciones/leidas/$PACUSR"
curl -s -X PATCH "http://localhost:3000/api/notificaciones/<id_notif>/leer"
```

---

## 5. Pruebas manuales por la interfaz (http://localhost:3001)

### Como paciente (Juan Domínguez — Plan 210)

1. **Inicio** → en "Ingresá a la demo" elegir **Juan Domínguez**. Redirige a *Buscar turnos*.
2. **Buscar turnos**:
   - Filtrar por profesional / especialidad / práctica / sede / rango de fechas.
   - Cambiar *Ordenar por* (Fecha / Costo) y *Sentido* (Asc / Desc).
   - Verificar que cada tarjeta muestra el profesional, servicio, fecha/hora/sede,
     el **badge de cobertura** (Cubierto / parcial / no cubierto) y el **monto a
     abonar** (ej.: Cardiología muestra $6.000 con descuento sobre $30.000).
   - Usar la **paginación** (Anterior / Siguiente).
3. **Preselección (carrito)**:
   - "Preseleccionar" en uno o varios turnos → aparece el contador en el menú.
   - Ir a *Preselección*: ver el resumen con el **total a abonar**, quitar turnos,
     "Reservar todos" o "Vaciar".
4. **Reservar** un turno desde la búsqueda → toast de éxito; el turno desaparece de
   disponibles.
5. **Mis turnos**: ver el historial, **cancelar** (con motivo) o **solicitar cambio
   de fecha**.
6. **Notificaciones**: pestañas *Sin leer* / *Leídas* y "Marcar como leída".

### Como médico (Dr. Carlos Gómez)

1. **Inicio** → elegir **Dr. Carlos Gómez**. Redirige al *Panel médico*.
2. **Agenda**: filtrar por estado; sobre un turno RESERVADO → **Aceptar**,
   **Realizado** o **Cancelar** (con motivo). Al aceptar, el paciente recibe la
   notificación.
3. **Servicios**: dar de alta / baja especialidades y prácticas.
4. **Disponibilidad**: ver la disponibilidad actual y **definir una nueva** (el
   sistema informa cuántos turnos se generaron).

---

## 6. Verificación responsive / accesibilidad (rápida)

- Achicar la ventana (o usar DevTools, vista móvil): la barra superior pasa a menú
  hamburguesa y las grillas a una sola columna.
- Navegar con **Tab**: el foco se ve claramente; el modal se cierra con **Escape**.
- El primer Tab al cargar ofrece el enlace "Saltar al contenido".

---

## 7. Notas

- Si la búsqueda no trae resultados, correr `npm run batch` para regenerar turnos
  (los del seed son de la semana siguiente; el batch llena los próximos 14 días).
- Para empezar de cero en cualquier momento: `npm run seed` (borra y recarga).
