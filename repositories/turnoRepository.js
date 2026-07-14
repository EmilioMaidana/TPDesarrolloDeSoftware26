import { TurnoModel } from "../schemas/turnoSchema.js";
import { DiaSemanaNumero, EstadoTurno } from "../domain/Enums.js";

// Offset del huso horario local del server como string tipo "-03:00",
// para usar en las agregaciones de Mongo ($dateToString / $dayOfWeek).
function zonaHorariaLocal() {
    const offsetMin = new Date().getTimezoneOffset(); // ej. 180 para UTC-3
    const signo = offsetMin > 0 ? '-' : '+';
    const abs = Math.abs(offsetMin);
    const hh = String(Math.floor(abs / 60)).padStart(2, '0');
    const mm = String(abs % 60).padStart(2, '0');
    return `${signo}${hh}:${mm}`;
}

export class TurnoRepository {



    async findById(id) {
        return await TurnoModel.findOne({ _id: id, eliminado: false });
    }

    async findByIdPopulated(id) {
        return await TurnoModel.findOne({ _id: id, eliminado: false })
            .populate('medico')
            .populate('paciente')
            .populate('servicio');
    }



    // Búsqueda de turnos disponibles con filtros, paginación y ordenamiento
    async buscarDisponibles({ medicoId, especialidadId, practicaId, sede, fechaInicio, fechaFin } = {}, page = 1, limit = 10, sortBy = ['fechaHora'], order = ['asc']) {
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

        const sortObj = {};
        for (let i = 0; i < sortBy.length; i++) {
            const field = sortBy[i];
            const direction = (order[i] && order[i] === 'desc') ? -1 : 1;
            sortObj[field] = direction;
        }

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

    // Turnos de un médico (opcionalmente filtrados por estado y/o paciente)
    async findByMedico(medicoId, estado = null, pacienteId = null) {
        const filtro = { medico: medicoId, eliminado: false };
        if (estado) filtro.estado = estado;
        if (pacienteId) filtro.paciente = pacienteId;
        return await TurnoModel.find(filtro)
            .populate('paciente', 'nombre dni')
            .populate('servicio')
            .sort({ fechaHora: 1 });
    }

    // Historial de turnos de un paciente
    async findByPaciente(pacienteId) {
        return await TurnoModel.find({ paciente: pacienteId, eliminado: false })
            .populate('medico', 'nombre matricula')
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

    async eliminarDisponiblesFuturosPorDisponibilidad(medicoId, disponibilidad) {
        const ahora = new Date();
        const diaSemanaMongo = DiaSemanaNumero[disponibilidad.diaSemana] + 1;
        // Los turnos se guardan en UTC pero representan la hora local de la sede;
        // comparamos el día y la hora en ese mismo huso horario local.
        const tz = zonaHorariaLocal();
        const horaDelTurno = {
            $dateToString: {
                format: "%H:%M",
                date: "$fechaHora",
                timezone: tz
            }
        };

        return await TurnoModel.deleteMany({
            medico: medicoId,
            estado: EstadoTurno.DISPONIBLE,
            fechaHora: { $gt: ahora },
            servicio: disponibilidad.servicio,
            servicioTipo: disponibilidad.servicioTipo,
            eliminado: false,
            $expr: {
                $and: [
                    { $eq: [{ $dayOfWeek: { date: "$fechaHora", timezone: tz } }, diaSemanaMongo] },
                    { $gte: [horaDelTurno, disponibilidad.horaDesde] },
                    { $lt: [horaDelTurno, disponibilidad.horaHasta] }
                ]
            }
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

    // Buscar turnos de un rango de fechas para enviar recordatorios
    async findTurnosParaRecordatorio(inicio, fin) {
        return await TurnoModel.find({
            fechaHora: { $gte: inicio, $lte: fin },
            estado: { $in: [EstadoTurno.RESERVADO, EstadoTurno.CONFIRMADO] },
            eliminado: false
        })
        .populate('paciente')
        .populate('medico');
    }
}
