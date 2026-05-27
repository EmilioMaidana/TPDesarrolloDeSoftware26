import { BadRequestError,} from "../errors/AppError.js"
import { disponibiliddadService } from "../services/TurnoService.js";

export class DisponibilidadController {
    constructor(disponibilidadService) {
        this.disponibilidadService = disponibilidadService
    }

    async findAll(req, res, next) {
        try { 
            const disponibilidad = await this.disponibilidadService.findAll();
            res.json(disponibilidad);
        } catch (error) {
            next(error);
        }
    }


}