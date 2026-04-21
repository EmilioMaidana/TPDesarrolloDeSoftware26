# TPDesarrolloDeSoftware26
Tp de la materia Desarrollo de software utnba

## Para comenzar

### 1. Crea el archivo package.json (si no lo tienen aun)
npm init -y

### 2. Instala la libreria Express
npm install express

### 3. Arranca el servidor
node app.js


GitFlow:

main: Es la rama principal. El codigo aqui siempre debe estar listo para produccion y ser estable.

develop: Es la rama de integracion. Aqui unimos todas las nuevas funcionalidades antes de pasarlas a main.

Ramas de Feature (feature/nombre-de-tarea): Cada desarrollador crea una rama desde develop para trabajar en algo especifico. Por ejemplo: feature/health-check, feature/clases-dominio, feature/notificaciones.

Pull Requests (PR): Cuando una feature esta lista, se abre un PR hacia develop. Otro miembro del equipo revisa el codigo, y si todo esta bien, se aprueba y se hace el merge.