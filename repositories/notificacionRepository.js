import { NotificacionModel } from "../schemas/notificacionSchema.js";

export class NotificacionRepository {

    async findByUsuario(usuarioId, leidas) {
        const query = { destinatario: usuarioId };
        if (leidas !== undefined) {
            query.leida = leidas;
        }
        const sort = leidas === true ? { fechaHoraLeida: -1 } : { fechaHoraCreacion: -1 };
        return await NotificacionModel.find(query)
            .sort(sort)
            .populate('remitente', 'nombre nombreUsuario usuarioTipo')
            .populate('destinatario', 'nombre nombreUsuario usuarioTipo');
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
