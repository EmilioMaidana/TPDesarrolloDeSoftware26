import { EstadoTurno } from "../domain/Enums.js";
import { CotizadorService } from "../domain/CotizadorService.js";
import { NotFoundError, BadRequestError, ConflictError } from "../errors/AppErrors.js";

export class TurnoService {

    constructor(turnoRepository, pacienteRepository, medicoRepository, notificacionRepository) {
        this.turnoRepository = turnoRepository;
        this.pacienteRepository = pacienteRepository;
        this.medicoRepository = medicoRepository;
        this.notificacionRepository = notificacionRepository;
    }

    // Buscar turnos disponibles con filtros, paginación y cotización para un paciente
    async buscarDisponibles(filtros, pacienteId, page = 1, limit = 10, sortBy = 'fechaHora', order = 'asc') {
        // Obtener paciente con su plan para cotización
        const paciente = await this.pacienteRepository.findByIdConPlan(pacienteId);
        if (!paciente) {
            throw new NotFoundError('Paciente no encontrado');
        }

        // Buscar turnos disponibles
        const resultado = await this.turnoRepository.buscarDisponibles(filtros, page, limit, sortBy, order);

        // Cotizar cada turno según el plan del paciente
        const turnosConCotizacion = CotizadorService.cotizarMuchos(resultado.turnos, paciente.plan);

        // Si se ordena por costo, reordenar después de cotizar
        if (sortBy === 'costo') {
            turnosConCotizacion.sort((a, b) => {
                const diff = a.cotizacion.costoFinal - b.cotizacion.costoFinal;
                return order === 'desc' ? -diff : diff;
            });
        }

        return {
            turnos: turnosConCotizacion,
            paginacion: resultado.paginacion
        };
    }

    // Obtener turno por ID
    async obtenerPorId(id) {
        const turno = await this.turnoRepository.findByIdPopulated(id);
        if (!turno) {
            throw new NotFoundError('Turno no encontrado');
        }
        return turno;
    }

    // Reservar un turno (paciente)
    async reservar(turnoId, pacienteId) {
        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) {
            throw new NotFoundError('Turno no encontrado');
        }

        const paciente = await this.pacienteRepository.findById(pacienteId);
        if (!paciente) {
            throw new NotFoundError('Paciente no encontrado');
        }

        // Usar lógica de dominio
        turno.reservar(pacienteId, pacienteId);
        await turno.save();

        // Notificar al médico
        const medico = await this.medicoRepository.findById(turno.medico);
        if (medico) {
            await this.notificacionRepository.save({
                destinatario: medico.usuario,
                remitente: pacienteId,
                mensaje: `El paciente ${paciente.nombre} ha reservado un turno para ${new Date(turno.fechaHora).toLocaleString('es-AR')}`
            });
        }

        return turno;
    }

    // Cancelar un turno (paciente o médico)
    async cancelar(turnoId, usuarioId, motivo, esMedico = false) {
        const turno = await this.turnoRepository.findByIdPopulated(turnoId);
        if (!turno) {
            throw new NotFoundError('Turno no encontrado');
        }

        // Usar lógica de dominio
        turno.cancelar(usuarioId, motivo);
        await turno.save();

        // Notificar a la contraparte
        if (esMedico && turno.paciente) {
            // Médico cancela -> notificar al paciente
            await this.notificacionRepository.save({
                destinatario: turno.paciente._id || turno.paciente,
                remitente: usuarioId,
                mensaje: `Tu turno del ${new Date(turno.fechaHora).toLocaleString('es-AR')} fue cancelado por el médico. Motivo: ${motivo}`
            });
        } else if (!esMedico && turno.medico) {
            // Paciente cancela -> notificar al médico
            const medico = turno.medico._id ? turno.medico : await this.medicoRepository.findById(turno.medico);
            if (medico) {
                await this.notificacionRepository.save({
                    destinatario: medico.usuario,
                    remitente: usuarioId,
                    mensaje: `Un paciente ha cancelado su turno del ${new Date(turno.fechaHora).toLocaleString('es-AR')}. Motivo: ${motivo}`
                });
            }
        }

        return turno;
    }

    // Marcar turno como realizado (médico)
    async marcarRealizado(turnoId, medicoId) {
        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) {
            throw new NotFoundError('Turno no encontrado');
        }

        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) {
            throw new NotFoundError('Médico no encontrado');
        }

        // Verificar que el turno pertenece al médico
        if (turno.medico.toString() !== medicoId.toString()) {
            throw new BadRequestError('Este turno no pertenece al médico indicado');
        }

        turno.marcarRealizado(medico.usuario);
        await turno.save();

        return turno;
    }

    // Proponer reprogramación de fecha
    async proponerReprogramacion(turnoId, nuevaFecha, usuarioId) {
        const turno = await this.turnoRepository.findByIdPopulated(turnoId);
        if (!turno) {
            throw new NotFoundError('Turno no encontrado');
        }

        turno.proponerCambioFecha(new Date(nuevaFecha), usuarioId);
        await turno.save();

        // Notificar a la contraparte
        const mensaje = `Se ha propuesto un cambio de fecha para tu turno al ${new Date(nuevaFecha).toLocaleString('es-AR')}. Requiere confirmación.`;

        // Determinar a quién notificar
        if (turno.paciente) {
            const destinatarioPaciente = turno.paciente._id || turno.paciente;
            await this.notificacionRepository.save({
                destinatario: destinatarioPaciente,
                remitente: usuarioId,
                mensaje
            });
        }
        if (turno.medico) {
            const medico = turno.medico._id ? turno.medico : await this.medicoRepository.findById(turno.medico);
            if (medico) {
                await this.notificacionRepository.save({
                    destinatario: medico.usuario,
                    remitente: usuarioId,
                    mensaje
                });
            }
        }

        return turno;
    }

    // Confirmar reprogramación
    async confirmarReprogramacion(turnoId, usuarioId) {
        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) {
            throw new NotFoundError('Turno no encontrado');
        }

        turno.confirmarCambioFecha(usuarioId);
        await turno.save();

        return turno;
    }

    // Historial de turnos de un paciente
    async obtenerHistorialPaciente(pacienteId) {
        const paciente = await this.pacienteRepository.findById(pacienteId);
        if (!paciente) {
            throw new NotFoundError('Paciente no encontrado');
        }
        return await this.turnoRepository.findByPaciente(pacienteId);
    }

    // Historial de un paciente visto por un médico
    async obtenerHistorialPacienteParaMedico(medicoId, pacienteId) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) {
            throw new NotFoundError('Médico no encontrado');
        }
        return await this.turnoRepository.findByMedicoAndPaciente(medicoId, pacienteId);
    }
}