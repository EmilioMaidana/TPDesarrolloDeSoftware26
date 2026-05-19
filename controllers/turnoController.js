import {
    BadRequestError,
} from "../errors/AppError.js"
import { ProductoService } from "../services/ProductoService.js";

export class TurnoController {
    constructor({
        turnoService = new TurnoService()
    } = {}) {
        this.turnoService = turnoService;
    }


    findAll = async (req, res, next) => {
        try {
            const paginacion = this.extraerPaginacion(req.query)
            const filtros = this.extraerFiltros(req.query)
            const resultado = this.turnoService.obtenerTodos({ ...paginacion, filtros })

            return res.status(200).json({
                status: "success",
                data: resultado.productos,
                paginacion: {
                    numeroPagina: resultado.numeroPagina,
                    limitePorPagina: resultado.limitePorPagina,
                    totalPaginas: resultado.totalPaginas,
                    totalProductos: resultado.totalProductos
                }
            })
        } catch (error) {
            return next(error)
        }
    }

    create = async (req, res, next) => {
        try {
            //const datosTurno = this.extraerYValidarBodyProducto(req.body)
            const turnoCreado = this.turnoService.crear(datosTurno)

            return res.status(201).json({ status: "success", data: turnoCreado })
        } catch (error) {
            return next(error)
        }
    }

    findById = async (req, res, next) => {
        try {
            const id = this.parsearId(req.params.id)
            const turno = this.turnoService.obtenerPorId(id)

            return res.status(200).json({ status: "success", data: turno })
        } catch (error) {
            return next(error)
        }
    }

    update = async (req, res, next) => {
        try {
            const id = this.parsearId(req.params.id)
            const datosTurno = this.extraerYValidarBodyProducto(req.body)
            const turnoActualizado = this.turnoService.actualizar(id, datosTurno)

            return res.status(200).json({ status: "success", data: turnoActualizado })
        } catch (error) {
            return next(error)
        }
    }

    delete = async (req, res, next) => {
        try {
            const id = this.parsearId(req.params.id)
            const turnoEliminado = this.turnoService.eliminar(id)

            return res.status(200).json({ status: "success", data: turnoEliminado })
        } catch (error) {
            return next(error)
        }
    }

    parsearId(idParam) {
        const id = Number(idParam)

        this.validarEnteroPositivo(id, "id")

        return id
    }

    extraerYValidarBodyTurno(body) {
        if (!body || typeof body !== "object" || Array.isArray(body)) {
            throw new BadRequestError("El cuerpo de la request es inválido")
        }

        const camposPermitidos = ["medico","paciente","fechaHora","sede","servicio","estado","historialEstados","costo"]
        const camposBody = Object.keys(body)
        const camposNoPermitidos = camposBody.filter((campo) => !camposPermitidos.includes(campo))

        if (camposNoPermitidos.length > 0) {
            throw new BadRequestError(`Campos no permitidos en la request: ${camposNoPermitidos.join(", ")}`)
        }

        const camposFaltantes = camposPermitidos.filter((campo) => body[campo] === undefined)

        if (camposFaltantes.length > 0) {
            throw new BadRequestError(`Faltan campos obligatorios en la request: ${camposFaltantes.join(", ")}`)
        }

        return {
            medico: body.medico,
            paciente: body.paciente,
            fechaHora: body.fechaHora,
            sede: body.sede,
            servicio: body.servicio,
            estado: body.estado,
            historialEstados: body.historialEstados,
            costo: body.costo
        }
    }

    extraerFiltros(query) {
        const filtros = {}
        /*
        if (query.precioMin !== undefined) {
            const precioMin = Number(query.precioMin)
            if (!Number.isFinite(precioMin)) {
                throw new BadRequestError("precioMin debe ser un número válido")
            }
            filtros.precioMin = precioMin
        }

        if (query.precioMax !== undefined) {
            const precioMax = Number(query.precioMax)
            if (!Number.isFinite(precioMax)) {
                throw new BadRequestError("precioMax debe ser un número válido")
            }
            filtros.precioMax = precioMax
        }*/

        if (query.categoria !== undefined) {
            filtros.categoria = query.categoria
        }

        return filtros
    }

    extraerPaginacion(query) {
        const numeroPagina = query?.page === undefined ? 1 : Number(query.page)
        const limitePorPagina = query?.limit === undefined ? 10 : Number(query.limit)

        this.validarEnteroPositivo(numeroPagina, "page")
        this.validarEnteroPositivo(limitePorPagina, "limit")

        return { numeroPagina, limitePorPagina }
    }

    validarEnteroPositivo(numero, parametro) {
        if (!Number.isInteger(numero) || numero <= 0) {
            throw new BadRequestError(`El parámetro ${parametro} debe ser un entero positivo`)
        }
    }
}