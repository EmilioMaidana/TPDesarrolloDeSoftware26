import { BadRequestError,} from "../errors/AppError.js"
import { TurnoService } from "../services/TurnoService.js";

export class TurnoController {
    constructor(turnoService) {
        this.turnoService = turnoService
    }


    async findAll(req, res, next) {
        try { 
            const turno = await this.turnoService.findAll();
            res.json(turno);
        } catch (error) {
            next(error);
        }
    }

    
    async create(req, res, next) {
        try {
            const turno = await this.turnoService.create(req.body);
            res.status(201).json(turno);
        } catch (error) {
            next(error);
        }
    }

    async findById(req, res, next) {
        try {
            const turno = await this.turnoService.findById(req.params.id);
            res.json(turno);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const turno = await this.turnoService.update(req.params.id, req.body);
            /*
            if (!turno) {
                return res.status(404).json({ message: "Turno not found" });
            }
            */
            res.json(turno);
        } catch (error) {
            next(error);
        }
    }

    // Recordar que siempre intamos hacer baja logica
    async delete(req, res, next) {
        try {
            const turno = await this.turnoService.delete(req.params.id);
            res.json({ message: "Turno eliminado" });
        } catch (error) {
            next(error);
        }
    }

    //GET ALL PAGINADO
    async findAllPaginated(req, res, next) {
        try {
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || 5
            const resultado =  await this.turnoService.findAllPaginated(page, limit)
            res.json(resultado)
        } catch(error) {
            next(error)
        }
    }

    //SOFT DELETE
    async softDelete(req, res, next) {
        try {
            const resultado = await this.turnoService
                    .softDelete(req.params.id)
            res.json(resultado)
        } catch(error) {
            next(error)
        }
    }

}