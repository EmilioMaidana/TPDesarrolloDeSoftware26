import { Turno } from "../domain/Turno.js"
import { Constants } from "../domain/Enums.js"
import { diaSemana,
        EstadoTurno,
} from "../domain/Enums.js"
import {
    BadRequestError,
    NotFoundError,
    UnprocessableEntityError
} from "../errors/AppError.js"
import { TurnoModel } from "../schemas/TurnoSchema.js";


export class TurnoRepository {
    constructor() {
        this.turnos = {}
        this.nextId = 1
    }

    //Para consultar el historial de turnos de un paciente
    async buscarPorPaciente(pacienteId) {
        return TurnoModel.find({pacienteId});
    }

    obtenerTodos() {
        return Object.values(this.turnos).filter((turno) => turno.estado !== EstadoTurno.CANCELADO)
    }

    obtenerPaginados(numeroPagina, limitePorPagina, filtros = {}) {
        let turnos = this.obtenerTodos()

        //Arreglar la validacion de filtros
        if (filtros.estado !== undefined) {
            turnos = turnos.filter((t) => t.estado === EstadoTurno.DISPONIBLE)
        }

        if (filtros.diaSemana !== undefined) {
            turnos = turnos.filter((t) => (t) => t.diaSemana === filtros.diaSemana)
        }

        if (filtros.especialidad !== undefined) {
            turnos = turnos.filter((t) => t.servicio instanceof Practica || t.servicio instanceof Servicio)
        }

        const inicio = (numeroPagina - 1) * limitePorPagina
        const fin = inicio + limitePorPagina

        return {
            turnos: turnos.slice(inicio, fin),
            totalTurnos: turnos.length
        }
    }

    guardar(turno) {
        this.validarTurno(turno)

        const id = turno.id ?? this.nextId++
        turno.id = id
        this.turnos[id] = turno

        return turno
    }
    /*
    obtenerPorId(id, { incluirEliminados = false } = {}) {
        this.validarId(id)

        const turno = this.turnos[id] ?? null

        if (!turno) {
            return null
        }

        if (!incluirEliminados && turno.eliminado) {
            return null
        }

        return turno
    }*/

    obtenerPorNombre(nombre, { incluirEliminados = false } = {}) {
        this.validarNombre(nombre)
        const nombreNormalizado = nombre.trim().toLowerCase()

        return (
            Object.values(this.turnos).find((turno) => {
                if (!incluirEliminados && producto.eliminado) {
                    return false
                }

                return turno.medico?.nombre?.trim().toLowerCase() === nombreNormalizado
            }) ?? null
        )
    }

    eliminar(id) {
        this.validarId(id)

        const turnoAEliminar = this.turnos[id]

        if (!turnoAEliminar) {
            throw new NotFoundError("El id no pertenece a un turno existente")
        }

        delete this.turnos[id]
        return turnoAEliminar
    }

    validarTurno(turno) {
        if (!(turno instanceof Turno)) {
            throw new UnprocessableEntityError("El turno es inválido")
        }
    }

    validarId(id) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new BadRequestError("El id no es válido")
        }
    }

    validarNombre(nombre) {
        if (typeof nombre !== "string" || nombre.trim().length === 0) {
            throw new BadRequestError("El nombre del producto es obligatorio")
        }
    }
}