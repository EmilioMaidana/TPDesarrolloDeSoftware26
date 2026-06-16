import { NotFoundError } from "../errors/AppErrors.js";

export class MedicoService {

    constructor(medicoRepository) {
        this.medicoRepository = medicoRepository;
    }

    async listar() {
        return await this.medicoRepository.findAll();
    }

    async obtener(medicoId) {
        const medico = await this.medicoRepository.findByIdPopulated(medicoId);
        if (!medico) {
            throw new NotFoundError('Médico no encontrado');
        }
        return medico;
    }

    // Devuelve las sedes distintas (por nombre) de todos los médicos.
    // Se usa para poblar el filtro "sede" de la búsqueda de turnos.
    async listarSedes() {
        const medicos = await this.medicoRepository.findAll();
        const sedesPorNombre = new Map();
        for (const medico of medicos) {
            for (const sede of (medico.sedes || [])) {
                if (sede && sede.nombre && !sedesPorNombre.has(sede.nombre)) {
                    sedesPorNombre.set(sede.nombre, { nombre: sede.nombre, direccion: sede.direccion });
                }
            }
        }
        return Array.from(sedesPorNombre.values());
    }
}
