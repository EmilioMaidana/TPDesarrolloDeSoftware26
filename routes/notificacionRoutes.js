import express from 'express';

export function createNotificacionRoutes(notificacionController) {
    const router = express.Router();

    /**
     * @swagger
     * /api/notificaciones/no-leidas/{usuarioId}:
     *   get:
     *     summary: Obtener notificaciones no leídas de un usuario
     *     tags: [Notificaciones]
     *     parameters:
     *       - in: path
     *         name: usuarioId
     *         required: true
     *         schema: { type: string }
     *     responses:
     *       200:
     *         description: Lista de notificaciones no leídas
     */
    router.get('/no-leidas/:usuarioId', (req, res, next) => notificacionController.obtenerNoLeidas(req, res, next));

    /**
     * @swagger
     * /api/notificaciones/leidas/{usuarioId}:
     *   get:
     *     summary: Obtener notificaciones leídas de un usuario
     *     tags: [Notificaciones]
     *     parameters:
     *       - in: path
     *         name: usuarioId
     *         required: true
     *         schema: { type: string }
     *     responses:
     *       200:
     *         description: Lista de notificaciones leídas
     */
    router.get('/leidas/:usuarioId', (req, res, next) => notificacionController.obtenerLeidas(req, res, next));

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

    return router;
}
