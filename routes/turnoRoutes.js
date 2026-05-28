import express from 'express';

export function createTurnoRoutes(turnoController) {
    const router = express.Router();

    /**
     * @swagger
     * /api/turnos/disponibles:
     *   get:
     *     summary: Buscar turnos disponibles con filtros y cotización
     *     tags: [Búsqueda]
     *     parameters:
     *       - in: query
     *         name: pacienteId
     *         required: true
     *         schema: { type: string }
     *         description: ID del paciente (para calcular cotización)
     *       - in: query
     *         name: medicoId
     *         schema: { type: string }
     *         description: Filtrar por médico
     *       - in: query
     *         name: especialidadId
     *         schema: { type: string }
     *         description: Filtrar por especialidad
     *       - in: query
     *         name: practicaId
     *         schema: { type: string }
     *         description: Filtrar por práctica
     *       - in: query
     *         name: sede
     *         schema: { type: string }
     *         description: Filtrar por sede de atención
     *       - in: query
     *         name: fechaInicio
     *         schema: { type: string, format: date }
     *         description: Fecha inicio del rango
     *       - in: query
     *         name: fechaFin
     *         schema: { type: string, format: date }
     *         description: Fecha fin del rango
     *       - in: query
     *         name: page
     *         schema: { type: integer, default: 1 }
     *       - in: query
     *         name: limit
     *         schema: { type: integer, default: 10 }
     *       - in: query
     *         name: sortBy
     *         schema: { type: string, enum: [fechaHora, costo], default: fechaHora }
     *       - in: query
     *         name: order
     *         schema: { type: string, enum: [asc, desc], default: asc }
     *     responses:
     *       200:
     *         description: Lista paginada de turnos disponibles con cotización
     */
    router.get('/disponibles', (req, res, next) => turnoController.buscarDisponibles(req, res, next));

    /**
     * @swagger
     * /api/turnos/historial/paciente/{pacienteId}:
     *   get:
     *     summary: Consultar historial de turnos de un paciente
     *     tags: [Turnos]
     *     parameters:
     *       - in: path
     *         name: pacienteId
     *         required: true
     *         schema: { type: string }
     *     responses:
     *       200:
     *         description: Historial de turnos del paciente
     */
    router.get('/historial/paciente/:pacienteId', (req, res, next) => turnoController.historialPaciente(req, res, next));

    /**
     * @swagger
     * /api/turnos/historial/medico/{medicoId}/paciente/{pacienteId}:
     *   get:
     *     summary: Médico consulta historial de turnos de un paciente
     *     tags: [Turnos]
     *     parameters:
     *       - in: path
     *         name: medicoId
     *         required: true
     *         schema: { type: string }
     *       - in: path
     *         name: pacienteId
     *         required: true
     *         schema: { type: string }
     *     responses:
     *       200:
     *         description: Historial de turnos del paciente con el médico
     */
    router.get('/historial/medico/:medicoId/paciente/:pacienteId', (req, res, next) => turnoController.historialPacienteParaMedico(req, res, next));

    /**
     * @swagger
     * /api/turnos/{id}:
     *   get:
     *     summary: Obtener turno por ID
     *     tags: [Turnos]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: string }
     *     responses:
     *       200:
     *         description: Detalle del turno
     */
    router.get('/:id', (req, res, next) => turnoController.obtenerPorId(req, res, next));

    /**
     * @swagger
     * /api/turnos/{id}/reservar:
     *   post:
     *     summary: Reservar un turno disponible
     *     tags: [Turnos]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: string }
     *       - in: query
     *         name: pacienteId
     *         required: true
     *         schema: { type: string }
     *     responses:
     *       200:
     *         description: Turno reservado exitosamente
     */
    router.post('/:id/reservar', (req, res, next) => turnoController.reservar(req, res, next));

    /**
     * @swagger
     * /api/turnos/{id}/cancelar:
     *   post:
     *     summary: Cancelar un turno (requiere >= 1 hora de anticipación)
     *     tags: [Turnos]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: string }
     *       - in: query
     *         name: usuarioId
     *         required: true
     *         schema: { type: string }
     *       - in: query
     *         name: esMedico
     *         schema: { type: boolean, default: false }
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [motivo]
     *             properties:
     *               motivo: { type: string, description: Motivo de cancelación }
     *     responses:
     *       200:
     *         description: Turno cancelado exitosamente
     */
    router.post('/:id/cancelar', (req, res, next) => turnoController.cancelar(req, res, next));

    /**
     * @swagger
     * /api/turnos/{id}/reprogramar:
     *   patch:
     *     summary: Proponer cambio de fecha de un turno
     *     tags: [Turnos]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: string }
     *       - in: query
     *         name: usuarioId
     *         required: true
     *         schema: { type: string }
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [nuevaFecha]
     *             properties:
     *               nuevaFecha: { type: string, format: date-time }
     *     responses:
     *       200:
     *         description: Propuesta de reprogramación enviada
     */
    router.patch('/:id/reprogramar', (req, res, next) => turnoController.reprogramar(req, res, next));

    /**
     * @swagger
     * /api/turnos/{id}/confirmar-reprogramacion:
     *   patch:
     *     summary: Confirmar la reprogramación de un turno
     *     tags: [Turnos]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: string }
     *       - in: query
     *         name: usuarioId
     *         required: true
     *         schema: { type: string }
     *     responses:
     *       200:
     *         description: Reprogramación confirmada
     */
    router.patch('/:id/confirmar-reprogramacion', (req, res, next) => turnoController.confirmarReprogramacion(req, res, next));

    /**
     * @swagger
     * /api/turnos/{id}/realizado:
     *   patch:
     *     summary: Marcar un turno como realizado
     *     tags: [Turnos]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: string }
     *       - in: query
     *         name: medicoId
     *         required: true
     *         schema: { type: string }
     *     responses:
     *       200:
     *         description: Turno marcado como realizado
     */
    router.patch('/:id/realizado', (req, res, next) => turnoController.marcarRealizado(req, res, next));

    return router;
}