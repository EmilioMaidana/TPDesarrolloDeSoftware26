import { EspecialidadModel } from "../schemas/especialidadSchema.js";
import { PracticaModel } from "../schemas/practicaSchema.js";

export class ServicioRepository {

    // Especialidades
    async findAllEspecialidades() {
        return await EspecialidadModel.find({ eliminado: false });
    }

    async findEspecialidadById(id) {
        return await EspecialidadModel.findOne({ _id: id, eliminado: false });
    }

    async createEspecialidad(data) {
        const especialidad = new EspecialidadModel(data);
        return await especialidad.save();
    }

    async updateEspecialidad(id, data) {
        return await EspecialidadModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    async softDeleteEspecialidad(id) {
        return await EspecialidadModel.findByIdAndUpdate(id, { eliminado: true }, { new: true });
    }

    // Prácticas
    async findAllPracticas() {
        return await PracticaModel.find({ eliminado: false });
    }

    async findPracticaById(id) {
        return await PracticaModel.findOne({ _id: id, eliminado: false });
    }

    async createPractica(data) {
        const practica = new PracticaModel(data);
        return await practica.save();
    }

    async updatePractica(id, data) {
        return await PracticaModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    async softDeletePractica(id) {
        return await PracticaModel.findByIdAndUpdate(id, { eliminado: true }, { new: true });
    }

    // Genérico: buscar servicio por tipo e ID
    async findServicioById(tipo, id) {
        if (tipo === 'Especialidad') {
            return await this.findEspecialidadById(id);
        } else {
            return await this.findPracticaById(id);
        }
    }
}
