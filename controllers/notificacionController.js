export class NotificacionController {

    constructor(notificacionService) {
        this.notificacionService = notificacionService;
    }

    // GET /api/notificaciones/:usuarioId
    async obtenerNotificaciones(req, res, next) {
        try {
            const { usuarioId } = req.params;
            const { leidas } = req.query;
            
            let leidasFilter;
            if (leidas !== undefined) {
                const val = String(leidas).toLowerCase();
                if (val === 'true' || val === '1') leidasFilter = true;
                else if (val === 'false' || val === '0') leidasFilter = false;
            }

            const notificaciones = await this.notificacionService.obtenerPorUsuario(usuarioId, leidasFilter);
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
