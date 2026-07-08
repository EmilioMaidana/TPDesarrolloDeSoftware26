import { UsuarioModel } from "../schemas/usuarioSchema.js";

export class UsuarioRepository {

    async findByNombreUsuario(nombreUsuario) {
        return await UsuarioModel.findOne({ nombreUsuario, eliminado: false });
    }

    async findById(id) {
        return await UsuarioModel.findOne({ _id: id, eliminado: false });
    }
}
