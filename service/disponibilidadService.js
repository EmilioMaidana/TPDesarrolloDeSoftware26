import { NotFoundError, BadRequestError } from "../errors/AppErrors.js";
import { Agenda } from "../domain/Agenda.js";

export class DisponibilidadService {

    constructor(medicoRepository, turnoRepository, servicioRepository) {
        this.medicoRepository = medicoRepository;
        this.turnoRepository = turnoRepository;
        this.servicioRepository = servicioRepository;
    }

    // Consultar disponibilidad de un médico
    async consultarDisponibilidad(medicoId, servicioId = null) {
        const medico = await this.medicoRepository.findByIdPopulated(medicoId);
        if (!medico) {
            throw new NotFoundError('Médico no encontrado');
        }

        if (servicioId) {
            return medico.disponibilidades.filter(
                d => d.servicio.toString() === servicioId.toString()
            );
        }

        return medico.disponibilidades;
    }

    // Actualizar disponibilidad de un médico
    async actualizarDisponibilidad(medicoId, nuevasDisponibilidades) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) {
            throw new NotFoundError('Médico no encontrado');
        }

        // Actualizar las disponibilidades del médico
        await this.medicoRepository.actualizarDisponibilidad(medicoId, nuevasDisponibilidades);

        // Eliminar turnos futuros DISPONIBLES y regenerar
        await this.turnoRepository.eliminarDisponiblesFuturos(medicoId);

        // Regenerar turnos con las nuevas disponibilidades
        const medicoActualizado = await this.medicoRepository.findById(medicoId);
        const diasAdelante = parseInt(process.env.BATCH_DAYS_AHEAD) || 14;

        // Obtener info de los servicios
        const serviciosMap = new Map();
        for (const disp of medicoActualizado.disponibilidades) {
            if (!serviciosMap.has(disp.servicio.toString())) {
                const servicio = await this.servicioRepository.findServicioById(disp.servicioTipo, disp.servicio);
                if (servicio) {
                    serviciosMap.set(disp.servicio.toString(), {
                        duracionTurnoEnMins: servicio.duracionTurnoEnMins,
                        costoConsulta: servicio.costoConsulta
                    });
                }
            }
        }

        const nuevosTurnos = Agenda.generarTurnosParaMedico(medicoActualizado, diasAdelante, serviciosMap);

        if (nuevosTurnos.length > 0) {
            // Filtrar turnos que no colisionen con reservados existentes
            const turnosFiltrados = [];
            for (const turno of nuevosTurnos) {
                const existe = await this.turnoRepository.existeTurnoEnHorario(turno.medico, turno.fechaHora);
                if (!existe) {
                    turnosFiltrados.push(turno);
                }
            }
            if (turnosFiltrados.length > 0) {
                await this.turnoRepository.insertMany(turnosFiltrados);
            }
        }

        return medicoActualizado.disponibilidades;
    }
}