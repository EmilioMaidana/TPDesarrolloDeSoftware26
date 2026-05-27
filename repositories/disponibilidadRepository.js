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
import { disponibilidadModel } from "../schemas/disponibilidadSchema.js";


export class TurnoRepository {
    constructor(){
        this.model = disponibilidadModel
    }

    async findAll() {
        return this.model.find()
    }

    
    
}

