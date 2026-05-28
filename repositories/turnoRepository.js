import { TurnoModel } from "../schemas/turnoSchema.js";
import { EstadoTurno } from "../domain/Enums.js";

export class TurnoRepository {

    async findAll() {
        return await TurnoModel.find({ eliminado: false });
    }

    async findById(id) {
        return await TurnoModel.findOne({ _id: id, eliminado: false });
    }

    async findByIdPopulated(id) {
        return await TurnoModel.findOne({ _id: id, eliminado: false })
            .populate('medico')
            .populate('paciente')
            .populate('servicio');
    }

    async save(turnoData) {
        const turno = new TurnoModel(turnoData);
        return await turno.save();
    }

    async update(id, data) {
        return await TurnoModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    async softDelete(id) {
        return await TurnoModel.findByIdAndUpdate(id, { eliminado: true }, { new: true });
    }

    async findByMedicoAndFecha(medicoId, fechaHora) {
        return await TurnoModel.findOne({
            medico: medicoId,
            fechaHora: fechaHora,
            eliminado: false,
            estado: { $ne: EstadoTurno.CANCELADO }
        });
    }

    // Búsqueda de turnos disponibles con filtros, paginación y ordenamiento
    async buscarDisponibles({ medicoId, especialidadId, practicaId, sede, fechaInicio, fechaFin } = {}, page = 1, limit = 10, sortBy = 'fechaHora', order = 'asc') {
        const filtro = {
            estado: EstadoTurno.DISPONIBLE,
            eliminado: false
        };

        if (medicoId) filtro.medico = medicoId;
        if (especialidadId) {
            filtro.servicio = especialidadId;
            filtro.servicioTipo = 'Especialidad';
        }
        if (practicaId) {
            filtro.servicio = practicaId;
            filtro.servicioTipo = 'Practica';
        }
        if (sede) filtro['sede.nombre'] = { $regex: sede, $options: 'i' };
        if (fechaInicio || fechaFin) {
            filtro.fechaHora = {};
            if (fechaInicio) filtro.fechaHora.$gte = new Date(fechaInicio);
            if (fechaFin) filtro.fechaHora.$lte = new Date(fechaFin);
        }

        const sortOrder = order === 'desc' ? -1 : 1;
        const sortObj = {};
        sortObj[sortBy] = sortOrder;

        const skip = (page - 1) * limit;

        const [turnos, total] = await Promise.all([
            TurnoModel.find(filtro)
                .populate('medico', 'nombre matricula especialidades practicas')
                .populate('servicio')
                .sort(sortObj)
                .skip(skip)
                .limit(limit),
            TurnoModel.countDocuments(filtro)
        ]);

        return {
            turnos,
            paginacion: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    // Historial de turnos de un paciente
    async findByPaciente(pacienteId) {
        return await TurnoModel.find({ paciente: pacienteId, eliminado: false })
            .populate('medico', 'nombre matricula')
            .populate('servicio')
            .sort({ fechaHora: -1 });
    }

    // Historial de turnos de un paciente visto por un médico
    async findByMedicoAndPaciente(medicoId, pacienteId) {
        return await TurnoModel.find({
            medico: medicoId,
            paciente: pacienteId,
            eliminado: false
        })
            .populate('servicio')
            .sort({ fechaHora: -1 });
    }

    // Eliminar turnos DISPONIBLES futuros de un médico (para regeneración batch)
    async eliminarDisponiblesFuturos(medicoId) {
        const ahora = new Date();
        return await TurnoModel.deleteMany({
            medico: medicoId,
            estado: EstadoTurno.DISPONIBLE,
            fechaHora: { $gt: ahora },
            eliminado: false
        });
    }

    // Bulk insert para el batch
    async insertMany(turnos) {
        return await TurnoModel.insertMany(turnos);
    }

    // Verificar si ya existe un turno para un médico en una fecha/hora
    async existeTurnoEnHorario(medicoId, fechaHora) {
        return await TurnoModel.findOne({
            medico: medicoId,
            fechaHora: fechaHora,
            estado: { $in: [EstadoTurno.DISPONIBLE, EstadoTurno.RESERVADO, EstadoTurno.CONFIRMADO] },
            eliminado: false
        });
    }
}