import express from 'express';

export function createNotificacionRoutes(notificacionController) {
    const router = express.Router();

/**
     * @swagger
     * /api/notificaciones/{usuarioId}:
     *   get:
     *     summary: Obtener notificaciones de un usuario
     *     tags: [Notificaciones]
     *     parameters:
     *       - in: path
     *         name: usuarioId
     *         required: true
     *         description: ID del usuario
     *         schema: 
     *           type: string
     *       - in: query
     *         name: leidas
     *         required: false
     *         description: Filtrar notificaciones por estado de lectura (true o false)
     *         schema: 
     *           type: boolean
     *     responses:
     *       200:
     *         description: Lista de notificaciones
     */
    router.get('/:usuarioId', (req, res, next) => notificacionController.obtenerNotificaciones(req, res, next));

    /**
     * @swagger
     * /api/notificaciones/{id}/leer:
     *   patch:
     *     summary: Marcar una notificación como leída
     *     tags: [Notificaciones]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: string }
     *     responses:
     *       200:
     *         description: Notificación marcada como leída
     */
    router.patch('/:id/leer', (req, res, next) => notificacionController.marcarComoLeida(req, res, next));
    //cambiar por put o post lectura notificacion/:id/lectura
    return router;
}
