import { NotFoundError } from "../errors/AppErrors.js";

export class PacienteService {

    constructor(pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    async listar() {
        return await this.pacienteRepository.findAll();
    }

    async obtener(id) {
        const paciente = await this.pacienteRepository.findByIdConPlan(id);
        if (!paciente) {
            throw new NotFoundError('Paciente no encontrado');
        }
        return paciente;
    }
}
