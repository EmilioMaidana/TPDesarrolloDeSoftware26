import express from 'express';

export function createMedicoRoutes(disponibilidadController, servicioController) {
    const router = express.Router();

    /**
     * @swagger
     * /api/medicos/{medicoId}/disponibilidad:
     *   get:
     *     summary: Consultar disponibilidad horaria de un medico
     *     tags: [Médicos]
     *     parameters:
     *       - in: path
     *         name: medicoId
     *         required: true
     *         schema: { type: string }
     *       - in: query
     *         name: servicioId
     *         schema: { type: string }
     *         description: Filtrar por especialidad o practica especifica
     *     responses:
     *       200:
     *         description: Lista de disponibilidades horarias
     */
    router.get('/:medicoId/disponibilidad', (req, res, next) => disponibilidadController.consultarDisponibilidad(req, res, next));

    /**
     * @swagger
     * /api/medicos/{medicoId}/disponibilidad:
     *   post:
     *     summary: Crear una disponibilidad horaria para un medico
     *     tags: [Médicos]
     *     parameters:
     *       - in: path
     *         name: medicoId
     *         required: true
     *         schema: { type: string }
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [diaSemana, horaDesde, horaHasta, servicio, servicioTipo]
     *             properties:
     *               diaSemana: { type: string, enum: [LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO, DOMINGO] }
     *               horaDesde: { type: string, example: "08:00" }
     *               horaHasta: { type: string, example: "12:00" }
     *               servicio: { type: string, description: ID de la especialidad o practica }
     *               servicioTipo: { type: string, enum: [Especialidad, Practica] }
     *               sede:
     *                 type: object
     *                 properties:
     *                   nombre: { type: string }
     *                   direccion: { type: string }
     *     responses:
     *       201:
     *         description: Disponibilidad creada y turnos generados
     */
    router.post('/:medicoId/disponibilidad', (req, res, next) => disponibilidadController.crearDisponibilidad(req, res, next));

    /**
     * @swagger
     * /api/medicos/{medicoId}/disponibilidad:
     *   put:
     *     summary: Actualizar disponibilidad horaria de un medico
     *     tags: [Médicos]
     *     parameters:
     *       - in: path
     *         name: medicoId
     *         required: true
     *         schema: { type: string }
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [disponibilidades]
     *             properties:
     *               disponibilidades:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     diaSemana: { type: string, enum: [LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO, DOMINGO] }
     *                     horaDesde: { type: string, example: "08:00" }
     *                     horaHasta: { type: string, example: "12:00" }
     *                     servicio: { type: string, description: ID de la especialidad o practica }
     *                     servicioTipo: { type: string, enum: [Especialidad, Practica] }
     *                     sede: { type: object, properties: { nombre: { type: string }, direccion: { type: string } } }
     *     responses:
     *       200:
     *         description: Disponibilidad actualizada y turnos regenerados
     */
    router.put('/:medicoId/disponibilidad', (req, res, next) => disponibilidadController.actualizarDisponibilidad(req, res, next));

    /**
     * @swagger
     * /api/medicos/{medicoId}/servicios:
     *   get:
     *     summary: Listar servicios (especialidades y practicas) de un medico
     *     tags: [Servicios]
     *     parameters:
     *       - in: path
     *         name: medicoId
     *         required: true
     *         schema: { type: string }
     *     responses:
     *       200:
     *         description: Especialidades y practicas del medico
     */
    router.get('/:medicoId/servicios', (req, res, next) => servicioController.listarServiciosDeMedico(req, res, next));

    /**
     * @swagger
     * /api/medicos/{medicoId}/servicios:
     *   post:
     *     summary: Agregar un servicio a un medico
     *     tags: [Servicios]
     *     parameters:
     *       - in: path
     *         name: medicoId
     *         required: true
     *         schema: { type: string }
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [tipo, servicioId]
     *             properties:
     *               tipo: { type: string, enum: [Especialidad, Practica] }
     *               servicioId: { type: string }
     *     responses:
     *       201:
     *         description: Servicio agregado
     */
    router.post('/:medicoId/servicios', (req, res, next) => servicioController.altaServicio(req, res, next));

    /**
     * @swagger
     * /api/medicos/{medicoId}/servicios/{servicioId}:
     *   delete:
     *     summary: Quitar un servicio de un medico
     *     tags: [Servicios]
     *     parameters:
     *       - in: path
     *         name: medicoId
     *         required: true
     *         schema: { type: string }
     *       - in: path
     *         name: servicioId
     *         required: true
     *         schema: { type: string }
     *       - in: query
     *         name: tipo
     *         required: true
     *         schema: { type: string, enum: [Especialidad, Practica] }
     *     responses:
     *       200:
     *         description: Servicio eliminado
     */
    router.delete('/:medicoId/servicios/:servicioId', (req, res, next) => servicioController.bajaServicio(req, res, next));

    return router;
}
