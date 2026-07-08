# Despliegue en la nube

El sistema se despliega en tres servicios:

- **MongoDB Atlas** — base de datos administrada (reemplaza al Mongo local).
- **Render** — backend (API Express).
- **Netlify** — frontend (Next.js).

> Render y Netlify se pueden reemplazar por alternativas equivalentes
> (Railway, Fly.io, Vercel, etc.) acordadas con la cátedra.

---

## 0) Base de datos — MongoDB Atlas (una sola vez)

1. Crear una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas) y un cluster
   gratuito (M0).
2. En **Database Access**, crear un usuario con contraseña.
3. En **Network Access**, permitir el acceso desde cualquier IP (`0.0.0.0/0`) para
   que Render pueda conectarse.
4. Copiar la **connection string** (formato
   `mongodb+srv://usuario:password@cluster.xxxx.mongodb.net`).

Esa URI se usa como `MONGODB_URI` en Render (sin el nombre de la base; el nombre
va en `MONGODB_DB_NAME`).

---

## 1) Backend en Render

### Primer deploy

1. Subir el repo a GitHub (si no está).
2. En Render: **New +  → Web Service** y conectar el repositorio.
3. Configuración:
   - **Root Directory**: *(vacío — el backend está en la raíz)*
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. **Environment Variables** (pestaña *Environment*):

   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | `mongodb+srv://usuario:password@cluster.xxxx.mongodb.net` |
   | `MONGODB_DB_NAME` | `SweetMedical` |
   | `BATCH_DAYS_AHEAD` | `14` |
   | `PUBLIC_URL` | `https://<tu-servicio>.onrender.com` |

   > No hace falta setear `PORT` ni `HOST`: Render inyecta `PORT` y el server ya
   > escucha en `0.0.0.0`.
5. Crear el servicio. Cuando termine el build, verificar:
   `https://<tu-servicio>.onrender.com/api/health`
6. **Cargar datos iniciales** (una vez): abrir la *Shell* del servicio en Render y
   ejecutar `npm run seed`. *(Alternativamente, correr el seed localmente apuntando
   `MONGODB_URI` a Atlas.)*

### Generación de turnos en producción

El proceso batch (`batch/generarTurnos.js`) ya programa una corrida diaria a las
00:00 con `node-cron`. Para una primera carga inmediata, ejecutar `npm run batch`
desde la Shell de Render. Si se prefiere un cron externo, configurar un
**Render Cron Job** que ejecute `npm run batch`.

### Subir una nueva release

Render hace **auto-deploy** en cada push a la rama configurada (`main`):

```bash
git checkout main
git pull
git merge feature/mi-cambio     # o el PR ya mergeado
git push origin main            # Render detecta el push y redeploya
```

Si cambian variables de entorno, editarlas en Render y hacer **Manual Deploy →
Clear build cache & deploy**.

---

## 2) Frontend en Netlify

### Primer deploy

1. En Netlify: **Add new site → Import an existing project** y elegir el repo.
2. Configuración de build:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/.next` *(Netlify lo detecta solo con el
     plugin oficial de Next.js)*
3. **Environment variables**:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_URL` | `https://<tu-servicio>.onrender.com/api` |

4. Deploy. Netlify instala automáticamente `@netlify/plugin-nextjs` (ver
   `frontend/netlify.toml`).

> Importante: como `NEXT_PUBLIC_API_URL` se "hornea" en build time, si cambia la
> URL del backend hay que **redeployar** el frontend.

### Subir una nueva release

Netlify también hace auto-deploy por push a `main`. Para forzar:
**Deploys → Trigger deploy → Deploy site**.

---

## 3) CORS

El backend habilita CORS para todos los orígenes (`app.use(cors())`), así que el
frontend de Netlify puede consumir la API de Render sin configuración extra. Si se
quisiera restringir, limitar el `origin` en `app.js` al dominio de Netlify.

---

## Checklist de despliegue

- [ ] Cluster de Atlas creado y accesible (`0.0.0.0/0`).
- [ ] Backend en Render responde `/api/health`.
- [ ] Datos cargados (`npm run seed`) y turnos generados (`npm run batch`).
- [ ] `PUBLIC_URL` apunta al dominio de Render.
- [ ] Frontend en Netlify con `NEXT_PUBLIC_API_URL` correcto.
- [ ] Flujo de búsqueda + reserva probado contra producción.
