import mongoose from "mongoose";
import { PacienteModel } from "../schemas/pacienteSchema.js";

export class PacienteRepository {

    _buildIdentityFilter(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        return {
            eliminado: false,
            $or: [
                { _id: id },
                { usuario: id }
            ]
        };
    }

    async findAll() {
        return await PacienteModel.find({ eliminado: false });
    }

    async findById(id) {
        const filtro = this._buildIdentityFilter(id);
        if (!filtro) return null;

        return await PacienteModel.findOne(filtro);
    }

    async findByIdConPlan(id) {
        const filtro = this._buildIdentityFilter(id);
        if (!filtro) return null;

        return await PacienteModel.findOne(filtro)
            .populate({
                path: 'plan',
                populate: [
                    { path: 'coberturasEspecialidad.especialidad' },
                    { path: 'coberturasPracticas.practica' }
                ]
            })
            .populate('obraSocial');
    }


}
