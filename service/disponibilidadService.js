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
    UnprocessableEntityError
} from "../errors/AppError.js"
import { TurnoRepository } from "../repositories/TurnoRepository.js";
import { Practica } from "../domain/practica.js";

export class disponibilidadService {
    
    constructor(disponibilidadRepository) {
        this.disponibilidadRepository = disponibilidadRepository
    }

     //Aca como mas nos guste podemos transformar el objeto a un DTO
    toDTO(disponibilidad) {
        return {
            id: disponibilidad.id || disponibilidad._id, //validacion de if default de mongo
            nombre: disponibilidad.nombre,
        }
    
    }

    async findAll() {
        const disponibilidades = await this.disponibilidadRepository.findAll();
        return disponibilidades.map(a => this.toDTO(a));
    }
    
}