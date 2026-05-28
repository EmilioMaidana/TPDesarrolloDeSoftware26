import { Agenda } from "../domain/Agenda.js"
import { Turno } from "../domain/Turno.js"
import { diaSemana,
        EstadoTurno,
} from "../domain/Enums.js"
import { Especialidad } from "../domain/especialidad.js"
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnprocessableEntityError,
    ValidationError
} from "../errors/AppError.js"
import { TurnoRepository } from "../repositories/TurnoRepository.js";
import { Practica } from "../domain/practica.js";

export class TurnoService {
    
    constructor(turnoRepository) {
        this.turnoRepository = turnoRepository
    }

    //Aca como mas nos guste podemos transformar el objeto a un DTO
    toDTO(turno) {
        return {
            id: turno.id || turno._id, //validacion de if default de mongo
            medico: turno.medico,
            paciente: turno.paciente,
            fechaHora: turno.fechaHora,
            sede: turno.sede,
            servicio: turno.servicio,
            estado: turno.estado,
            costo: turno.costo
        };
    }

    async findAll() {
        const turnos = await this.turnoRepository.findAll();
        return turnos.map(a => this.toDTO(a));
    }

    async create(data) {
        const { medico, paciente, fechaHora, sede, servicio, estado, historialEstados, costo, eliminado } = data;

        if (!medico || !paciente || !fechaHora || !sede || !servicio || !estado) {
            throw new ValidationError('algunos campos estan mal cargados o faltan');
        }

        // Buscar si ya existe un turno para ese medico en esa fechaHora
        const existente = await this.turnoRepository.findByMedicoAndFecha(medico, fechaHora);
        if (existente) {
            throw new ConflictError(`Ya existe un turno con este horario para este médico`);
        }

        const nuevo = new Turno(medico, paciente, fechaHora, sede, servicio, estado, historialEstados, costo, eliminado);
        const turnoGuardado = await this.turnoRepository.save(nuevo);

        return this.toDTO(turnoGuardado);
    }

    
    async findById(id) {
        const turno = await this.turnoRepository.findById(id);
        if (!turno) {
            throw new NotFoundError("Turno no encontrado");
        }

        return this.toDTO(turno);
    }
    

    async update(id, data) {
        const turno = await this.turnoRepository.findById(id);
        if (!turno) {
            throw new NotFoundError("Turno no encontrado");
        }

        if (data.nombre !== undefined) turno.nombre = data.nombre;
        //fijarse los datos correctos a actualizar segun el modelo
        //if (data.precioPorNoche !== undefined) turno.precioPorNoche = data.precioPorNoche;

        const actualizado = await this.turnoRepository.save(turno);
        return this.toDTO(actualizado);
    }

    async delete(id) {
        const turno = await this.turnoRepository.findById(id);
        if (!turno) {
            throw new NotFoundError("Turno no encontrado");
        }
        await this.turnoRepository.delete(id);
        return this.toDTO(turno);
    }

    //GET ALL PAGINADO
    async findAllPaginated(page, limit) {
        return await this.turnoRepository
            .findAllPaginated(page, limit)
    }

    //SOFT DELETE
    async softDelete(id) {
        return await this.turnoRepository
            .softDelete(id)
    }
}