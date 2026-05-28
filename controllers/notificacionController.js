export class NotificacionController {

    constructor(notificacionService) {
        this.notificacionService = notificacionService;
    }

    // GET /api/notificaciones/no-leidas/:usuarioId
    async obtenerNoLeidas(req, res, next) {
        try {
            const notificaciones = await this.notificacionService.obtenerNoLeidas(req.params.usuarioId);
            res.json(notificaciones);
        } catch (error) {
            next(error);
        }
    }

    // GET /api/notificaciones/leidas/:usuarioId
    async obtenerLeidas(req, res, next) {
        try {
            const notificaciones = await this.notificacionService.obtenerLeidas(req.params.usuarioId);
            res.json(notificaciones);
        } catch (error) {
            next(error);
        }
    }

    // PATCH /api/notificaciones/:id/leer
    async marcarComoLeida(req, res, next) {
        try {
            const notificacion = await this.notificacionService.marcarComoLeida(req.params.id);
            res.json({ message: 'Notificación marcada como leída', notificacion });
        } catch (error) {
            next(error);
        }
    }
}
