import { MedicoModel } from "../schemas/medicoSchema.js";

export class MedicoRepository {

    async findAll() {
        return await MedicoModel.find({ eliminado: false })
            .populate('especialidades')
            .populate('practicas');
    }

    async findById(id) {
        return await MedicoModel.findOne({ _id: id, eliminado: false });
    }

    async findByIdPopulated(id) {
        return await MedicoModel.findOne({ _id: id, eliminado: false })
            .populate('especialidades')
            .populate('practicas')
            .populate('usuario');
    }

    async findByUsuario(usuarioId) {
        return await MedicoModel.findOne({ usuario: usuarioId, eliminado: false });
    }

    async save(medicoData) {
        const medico = new MedicoModel(medicoData);
        return await medico.save();
    }

    async update(id, data) {
        return await MedicoModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    async actualizarDisponibilidad(id, disponibilidades) {
        return await MedicoModel.findByIdAndUpdate(
            id,
            { disponibilidades },
            { new: true, runValidators: true }
        );
    }

    async agregarServicio(medicoId, tipo, servicioId) {
        const campo = tipo === 'Especialidad' ? 'especialidades' : 'practicas';
        return await MedicoModel.findByIdAndUpdate(
            medicoId,
            { $addToSet: { [campo]: servicioId } },
            { new: true }
        );
    }

    async quitarServicio(medicoId, tipo, servicioId) {
        const campo = tipo === 'Especialidad' ? 'especialidades' : 'practicas';
        return await MedicoModel.findByIdAndUpdate(
            medicoId,
            { $pull: { [campo]: servicioId } },
            { new: true }
        );
    }

    async softDelete(id) {
        return await MedicoModel.findByIdAndUpdate(id, { eliminado: true }, { new: true });
    }
}
