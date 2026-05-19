import { Agenda } from "../domain/Agenda.js"
import { Turno } from "../domain/Turno.js"
import { Constants } from "../domain/Constants.js"
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnprocessableEntityError
} from "../errors/AppError.js"
import { TurnoRepository } from "../repositories/TurnoRepository.js";

export class TurnoService {
    constructor({
        turnoRepository = new TurnoRepository()
    } = {}) {
        this.turnoRepository = turnoRepository;
    }

    //Para consultar el historial de turnos de un paciente
    async consultarHistorialPaciente(idPaciente) {
        return turnoRepository.buscarPorPaciente(idPaciente);
    }

    obtenerTodos({ numeroPagina = 1, limitePorPagina = 10, filtros = {} } = {}) {
        this.validarPaginacion(numeroPagina, limitePorPagina)
        // arreglar la validacion de filtros
        //this.validarFiltros(filtros)

        const { turnos, totalTurnos } = this.turnoRepository.obtenerPaginados(
            numeroPagina,
            limitePorPagina,
            filtros
        )

        const totalPaginas = totalTurnos === 0 ? 0 : Math.ceil(totalTurnos / limitePorPagina)

        return {
            turnos,
            numeroPagina,
            limitePorPagina,
            totalPaginas,
            totalTurnos
        }
    }
    /*
    obtenerPorId(id) {
        this.validarEnteroPositivo(id, "Id")

        const turnos = this.turnoRepository.obtenerPorId(id)

        if (!turnos) {
            throw new NotFoundError("Turno no encontrado")
        }

        return turnos
    }*/

    crear(datosTurno) {
        this.validarDatosTurno(datosTurno)
        // verificar que validaciones tienen que realizarse en este punto
        this.validarNombreDisponible(datosTurno.getMedico().getNombre())
        this.validarNombreDisponible(datosTurno.getPaciente().getNombre())
        

        const turno = new Turno(
            datosTurno.medico,
            datosTurno.paciente,
            datosTurno.fechaHora,
            datosTurno.sede,
            datosTurno.servicio,
            datosTurno.estado,
            datosTurno.historialEstados,
            datosTurno.costo
        )

        return this.turnoRepository.guardar(turno)
    }

    actualizar(id, datosTurno) {
        this.validarEnteroPositivo(id, "Id")

        this.validarDatosTurno(datosTurno)

        const turnoExistente = this.obtenerPorId(id)
        this.validarNombreDisponible(datosTurno.getMedico().getNombre(),id)
        this.validarNombreDisponible(datosTurno.getPaciente().getNombre(),id)

        const turnoActualizado = new Turno(
            datosTurno.medico,
            datosTurno.paciente,
            datosTurno.fechaHora,
            datosTurno.sede,
            datosTurno.servicio,
            datosTurno.estado,
            datosTurno.historialEstados,
            datosTurno.costo
        )

        turnoActualizado.id = turnoExistente.id
        return this.turnoRepository.guardar(turnoActualizado)
    }

    eliminar(id) {
        this.validarEnteroPositivo(id, "Id")
        const turno = this.obtenerPorId(id)

        turno.estado = CANCELADO

        return this.turnoRepository.guardar(turno)
    }

    validarDatosTurno(datosTurno) {
        if (!datosTurno || typeof datosTurno !== "object" || Array.isArray(datosTurno)) {
            throw new BadRequestError("Los datos del turno son inválidos")
        }

        const {medico,paciente,fechaHora,sede,servicio,estado,historialEstados,costo} = datosTurno

        if (typeof medico.getNombre() !== "string" || medico.getNombre().trim().length < 3) {
            throw new UnprocessableEntityError("El nombre del medico del turno debe tener al menos 3 caracteres")
        }

        
        if (typeof paciente.getNombre() !== "string" || paciente.getNombre().trim().length < 3) {
            throw new UnprocessableEntityError("El nombre del paciente del turno debe tener al menos 3 caracteres")
        }

        if (!Number.isFinite(costo) || costo <= 0) {
            throw new UnprocessableEntityError("El precio debe ser mayor a 0")
        }

        if (!Date.isDate(fechaHora) || fechaHora <= 0) {
            throw new UnprocessableEntityError("El dia tiene que estar declarado")
        }

        if (estado !== Constants.EstadoTurno.CONFIRMADO || estado !== Constants.EstadoTurno.DISPONIBLE) {
            throw new UnprocessableEntityError("El estado del turno debe ser CONFIRMADO o DISPONIBLE")
        }
    }

    validarNombreDisponible(nombre, idActual = null) {
        const productoExistente = this.turnoRepository.obtenerPorNombre(nombre)
        const existeProductoConMismoNombre = productoExistente && productoExistente.id !== idActual

        if (existeProductoConMismoNombre) {
            throw new ConflictError("Ya existe un turno con este medico")
        }
    }

    /*validarFiltros({ precioMin, precioMax, categoria } = {}) {
        if (precioMin !== undefined && precioMin <= 0) {
            throw new BadRequestError("precioMin debe ser mayor a 0")
        }
        if (precioMax !== undefined && precioMax <= 0) {
            throw new BadRequestError("precioMax debe ser mayor a 0")
        }
        if (precioMin !== undefined && precioMax !== undefined && precioMin > precioMax) {
            throw new BadRequestError("precioMin no puede ser mayor que precioMax")
        }
        if (categoria !== undefined && (typeof categoria !== "string" || categoria.trim().length === 0)) {
            throw new BadRequestError("La categoría debe ser una cadena de texto no vacía")
        }
    }*/

    validarPaginacion(numeroPagina, limitePorPagina) {
        this.validarEnteroPositivo(numeroPagina, "Numero de página")
        this.validarEnteroPositivo(limitePorPagina, "Límite por página")
    }

    validarEnteroPositivo(numero, parametro) {
        if (!Number.isInteger(numero) || numero <= 0) {
            throw new BadRequestError(`${parametro} debe ser un entero positivo`)
        }
    }
}