import { PacienteModel } from "../schemas/pacienteSchema.js";

export class PacienteRepository {

    async findAll() {
        return await PacienteModel.find({ eliminado: false });
    }

    async findById(id) {
        return await PacienteModel.findOne({ _id: id, eliminado: false });
    }

    async findByIdConPlan(id) {
        return await PacienteModel.findOne({ _id: id, eliminado: false })
            .populate({
                path: 'plan',
                populate: [
                    { path: 'coberturasEspecialidad.especialidad' },
                    { path: 'coberturasPracticas.practica' }
                ]
            })
            .populate('obraSocial');
    }

    async save(pacienteData) {
        const paciente = new PacienteModel(pacienteData);
        return await paciente.save();
    }

    async update(id, data) {
        return await PacienteModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    async softDelete(id) {
        return await PacienteModel.findByIdAndUpdate(id, { eliminado: true }, { new: true });
    }
}
