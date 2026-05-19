import { Turno } from "../domain/Turno.js"
import { Constants } from "../domain/Constants.js"
import {
    BadRequestError,
    NotFoundError,
    UnprocessableEntityError
} from "../errors/AppError.js"

export class TurnoRepository {
    constructor() {
        this.turno = {}
        this.nextId = 1
    }

    obtenerTodos() {
        return Object.values(this.turnos).filter((turno) => !turno.getEstado() === Constants.EstadoTurno.CANCELADO)
    }

    obtenerPaginados(numeroPagina, limitePorPagina, filtros = {}) {
        let turnos = this.obtenerTodos()

        /*
        Arreglar la validacion de filtros
        if (filtros.precioMin !== undefined) {
            productos = productos.filter((p) => p.precio >= filtros.precioMin)
        }
        if (filtros.precioMax !== undefined) {
            productos = productos.filter((p) => p.precio <= filtros.precioMax)
        }
        if (filtros.categoria !== undefined) {
            const categoriaNormalizada = filtros.categoria.trim().toLowerCase()
            productos = productos.filter((p) => p.categoria.trim().toLowerCase() === categoriaNormalizada)
        }*/

        const inicio = (numeroPagina - 1) * limitePorPagina
        const fin = inicio + limitePorPagina

        return {
            turnos: turnos.slice(inicio, fin),
            totalTurnos: turnos.length
        }
    }

    guardar(turno) {
        this.validarProducto(turno)

        const id = turno.id ?? this.nextId++
        turno.id = id
        this.turnos[id] = turno

        return turno
    }

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
    }

    obtenerPorNombre(nombre, { incluirEliminados = false } = {}) {
        this.validarNombre(nombre)
        const nombreNormalizado = nombre.trim().toLowerCase()

        return (
            Object.values(this.productos).find((producto) => {
                if (!incluirEliminados && producto.eliminado) {
                    return false
                }

                return producto.nombre.trim().toLowerCase() === nombreNormalizado
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

    validarProducto(turno) {
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