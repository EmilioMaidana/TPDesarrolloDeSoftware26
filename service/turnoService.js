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

export class TurnoService {
    
    constructor(turnoRepository) {
        this.turnoRepository = turnoRepository
    }

    //Aca como mas nos guste podemos transformar el objeto a un DTO
    toDTO(turno) {
        return {
            id: turno.id || turno._id, //validacion de if default de mongo
            nombre: turno.nombre,
            //precioPorNoche: turno.precioPorNoche,
        };
    }

    async findAll() {
        const alojamientos = await this.turnoRepository.findAll();
        return alojamientos.map(a => this.toDTO(a));
    }

    async create(data) {
        const { nombre, precioPorNoche } = data;

        if (!nombre || !precioPorNoche) {
            throw new ValidationError('Nombre y precioPorNoche son requeridos');
        }

        const existente = await this.turnoRepository.findByName(nombre);
        if (existente) {
            throw new ConflictError(`Ya existe un turno con el nombre ${nombre}`);
        }

        const nuevo = new Alojamiento(nombre, precioPorNoche);
        const alojamientoGuardado = await this.turnoRepository.save(nuevo);

        return this.toDTO(alojamientoGuardado);
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