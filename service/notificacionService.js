import { NotFoundError } from "../errors/AppErrors.js";

export class NotificacionService {

    constructor(notificacionRepository) {
        this.notificacionRepository = notificacionRepository;
    }

    async obtenerPorUsuario(usuarioId, leidas) {
        return await this.notificacionRepository.findByUsuario(usuarioId, leidas);
    }

    async marcarComoLeida(notificacionId) {
        const notificacion = await this.notificacionRepository.findById(notificacionId);
        if (!notificacion) {
            throw new NotFoundError('Notificación no encontrada');
        }

        if (notificacion.leida) {
            throw new Error('La notificación ya fue leída');
        }

        return await this.notificacionRepository.marcarComoLeida(notificacionId);
    }

    async crearNotificacion(data) {
        return await this.notificacionRepository.save(data);
    }
}
