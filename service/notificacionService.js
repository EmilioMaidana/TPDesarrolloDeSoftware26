import { BadRequestError, NotFoundError } from "../errors/AppErrors.js";

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
            throw new BadRequestError('La notificación ya se encuentra leída');
        }

        return await this.notificacionRepository.marcarComoLeida(notificacionId);
    }


}
