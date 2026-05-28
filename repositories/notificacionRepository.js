import { NotificacionModel } from "../schemas/notificacionSchema.js";

export class NotificacionRepository {

    async findNoLeidas(usuarioId) {
        return await NotificacionModel.find({
            destinatario: usuarioId,
            leida: false
        }).sort({ fechaHoraCreacion: -1 });
    }

    async findLeidas(usuarioId) {
        return await NotificacionModel.find({
            destinatario: usuarioId,
            leida: true
        }).sort({ fechaHoraLeida: -1 });
    }

    async findById(id) {
        return await NotificacionModel.findById(id);
    }

    async save(notificacionData) {
        const notificacion = new NotificacionModel(notificacionData);
        return await notificacion.save();
    }

    async marcarComoLeida(id) {
        return await NotificacionModel.findByIdAndUpdate(
            id,
            { leida: true, fechaHoraLeida: new Date() },
            { new: true }
        );
    }
}
