import { NotFoundError, BadRequestError, ConflictError } from "../errors/AppErrors.js";

export class ServicioService {

    constructor(servicioRepository, medicoRepository) {
        this.servicioRepository = servicioRepository;
        this.medicoRepository = medicoRepository;
    }

    // Listar servicios de un médico
    async listarServiciosDeMedico(medicoId) {
        const medico = await this.medicoRepository.findByIdPopulated(medicoId);
        if (!medico) {
            throw new NotFoundError('Médico no encontrado');
        }
        return {
            especialidades: medico.especialidades,
            practicas: medico.practicas
        };
    }

    // Alta de servicio para un médico
    async altaServicio(medicoId, tipo, servicioId) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) {
            throw new NotFoundError('Médico no encontrado');
        }

        // Verificar que el servicio existe
        const servicio = await this.servicioRepository.findServicioById(tipo, servicioId);
        if (!servicio) {
            throw new NotFoundError(`${tipo} no encontrada`);
        }

        // Verificar que no lo tenga ya
        const campo = tipo === 'Especialidad' ? 'especialidades' : 'practicas';
        const yaExiste = medico[campo].some(s => s.toString() === servicioId.toString());
        if (yaExiste) {
            throw new ConflictError(`El médico ya tiene asignada esta ${tipo.toLowerCase()}`);
        }

        return await this.medicoRepository.agregarServicio(medicoId, tipo, servicioId);
    }

    // Baja de servicio de un médico
    async bajaServicio(medicoId, tipo, servicioId) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) {
            throw new NotFoundError('Médico no encontrado');
        }

        return await this.medicoRepository.quitarServicio(medicoId, tipo, servicioId);
    }

    // CRUD de especialidades
    async crearEspecialidad(data) {
        return await this.servicioRepository.createEspecialidad(data);
    }

    async actualizarEspecialidad(id, data) {
        const especialidad = await this.servicioRepository.findEspecialidadById(id);
        if (!especialidad) {
            throw new NotFoundError('Especialidad no encontrada');
        }
        return await this.servicioRepository.updateEspecialidad(id, data);
    }

    async eliminarEspecialidad(id) {
        return await this.servicioRepository.softDeleteEspecialidad(id);
    }

    // CRUD de prácticas
    async crearPractica(data) {
        return await this.servicioRepository.createPractica(data);
    }

    async actualizarPractica(id, data) {
        const practica = await this.servicioRepository.findPracticaById(id);
        if (!practica) {
            throw new NotFoundError('Práctica no encontrada');
        }
        return await this.servicioRepository.updatePractica(id, data);
    }

    async eliminarPractica(id) {
        return await this.servicioRepository.softDeletePractica(id);
    }

    async listarEspecialidades() {
        return await this.servicioRepository.findAllEspecialidades();
    }

    async listarPracticas() {
        return await this.servicioRepository.findAllPracticas();
    }
}
