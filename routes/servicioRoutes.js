import express from 'express';

export function createServicioRoutes(servicioController) {
    const router = express.Router();

    /**
     * @swagger
     * /api/servicios/especialidades:
     *   get:
     *     summary: Listar todas las especialidades
     *     tags: [Servicios]
     *     responses:
     *       200:
     *         description: Lista de especialidades
     *   post:
     *     summary: Crear una nueva especialidad
     *     tags: [Servicios]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [nombre, duracionTurnoEnMins, costoConsulta]
     *             properties:
     *               nombre: { type: string }
     *               duracionTurnoEnMins: { type: integer }
     *               costoConsulta: { type: number }
     *     responses:
     *       201:
     *         description: Especialidad creada
     */
    router.get('/especialidades', (req, res, next) => servicioController.listarEspecialidades(req, res, next));
    router.post('/especialidades', (req, res, next) => servicioController.crearEspecialidad(req, res, next));

    /**
     * @swagger
     * /api/servicios/especialidades/{id}:
     *   put:
     *     summary: Actualizar una especialidad
     *     tags: [Servicios]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: string }
     *     responses:
     *       200:
     *         description: Especialidad actualizada
     *   delete:
     *     summary: Eliminar una especialidad (baja lógica)
     *     tags: [Servicios]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: string }
     *     responses:
     *       200:
     *         description: Especialidad eliminada
     */
    router.put('/especialidades/:id', (req, res, next) => servicioController.actualizarEspecialidad(req, res, next));
    router.delete('/especialidades/:id', (req, res, next) => servicioController.eliminarEspecialidad(req, res, next));

    /**
     * @swagger
     * /api/servicios/practicas:
     *   get:
     *     summary: Listar todas las prácticas
     *     tags: [Servicios]
     *     responses:
     *       200:
     *         description: Lista de prácticas
     *   post:
     *     summary: Crear una nueva práctica
     *     tags: [Servicios]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [codigo, nombre, duracionTurnoEnMins, costoConsulta]
     *             properties:
     *               codigo: { type: string }
     *               nombre: { type: string }
     *               duracionTurnoEnMins: { type: integer }
     *               costoConsulta: { type: number }
     *     responses:
     *       201:
     *         description: Práctica creada
     */
    router.get('/practicas', (req, res, next) => servicioController.listarPracticas(req, res, next));
    router.post('/practicas', (req, res, next) => servicioController.crearPractica(req, res, next));

    /**
     * @swagger
     * /api/servicios/practicas/{id}:
     *   put:
     *     summary: Actualizar una práctica
     *     tags: [Servicios]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: string }
     *     responses:
     *       200:
     *         description: Práctica actualizada
     *   delete:
     *     summary: Eliminar una práctica (baja lógica)
     *     tags: [Servicios]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: string }
     *     responses:
     *       200:
     *         description: Práctica eliminada
     */
    router.put('/practicas/:id', (req, res, next) => servicioController.actualizarPractica(req, res, next));
    router.delete('/practicas/:id', (req, res, next) => servicioController.eliminarPractica(req, res, next));

    return router;
}
