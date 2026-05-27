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
    constructor(){
        this.model = turnoModel
    }

    async findAll() {
        return this.model.find()
    }

    async findByName(nombre) {
        return await this.model.findOne({nombre})
    }

    async save(turno) {
        const nuevoTurno = new this.model(turno)
        return await nuevoTurno.save()
    }

    async findById(id) {
        return await this.model.findById(id)
    }

    async update(id, turnoModificado) {
        return await this.model.findByIdAndUpdate(id, turnoModificado, { new: true })
    }

    async delete(id) {
        return await this.model.findByIdAndDelete(id)
    }
    
    async contar(){
        return await this.model.countDocuments()
    }

    async softDelete(id) {
        return await this.model.findByIdAndUpdate(id, 
            { 
                estado: Constants.ESTADO_INACTIVO 
            },
            { 
                new: true 
            })
    }

    async findAllPaginated(page = 1, limit=5) {
        const skipN = (page - 1) * limit
        
        const turnos = await this.model.find({estado: Constants.ESTADO_INACTIVO}).skip(skipN).limit(limit)

        const total = await this.model.countDocuments({estado: Constants.ESTADO_INACTIVO})

        return {page, limit, turnos, total: Math.ceil(total / limit)}
    }
}

/*

async save(reserva) {
 const query = reserva.id ? { _id: reserva.id } : {_id: new this.model()._id }

 return await this.model.findOneAndUpdate(query, reserva, 
    { new: true, runValidators: true, upsert: true })

asysnc reservasPorAlojamiento() {
    return await this.model.aggregate([
        {
            $group: {
                _id: "$alojamiento",
                totalReservas:{ 
                $sum: 1 
                }
            }
        },
        {
            $lookup: {
                from: "alojamientos",
                localField: "_id",
                foreignField: "_id",
                as: "alojamiento"

            }
        },
        {
            $unwind: "$alojamiento"
        },
        {
            $project: {
                _id: 0,
                alojamiento: "$alojamiento.nombre",
                totalReservas: 1
            }
        }
    ])}

*/ 