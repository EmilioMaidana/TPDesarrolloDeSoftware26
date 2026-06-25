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
        // Obtener turno con servicio populado (necesario para calcular cotización)
        const turno = await this.turnoRepository.findByIdPopulated(turnoId);
        if (!turno) {
            throw new NotFoundError('Turno no encontrado');
        }

        // Obtener paciente con su plan de obra social para cotizar
        const paciente = await this.pacienteRepository.findByIdConPlan(pacienteId);
        if (!paciente) {
            throw new NotFoundError('Paciente no encontrado');
        }

        // Calcular cotización según el plan del paciente
        const cotizacion = CotizadorService.cotizar(turno, paciente.plan);

        // Usar lógica de dominio — reservar con el costo con cobertura calculado
        turno.reservar(paciente._id, paciente._id, cotizacion.costoFinal);
        await turno.save();

        // Notificar al médico
        const medicoId = turno.medico._id || turno.medico;
        const medico = await this.medicoRepository.findById(medicoId);
        if (medico) {
            await this.notificacionRepository.save({
                destinatario: medico.usuario,
                remitente: pacienteId,
                mensaje: `El paciente ${paciente.nombre} ha reservado un turno para ${new Date(turno.fechaHora).toLocaleString('es-AR')}`
            });
        }

        return {
            ...turno.toJSON(),
            cotizacion
        };
    }

    // Cancelar un turno (paciente o médico)
    async cancelar(turnoId, usuarioId, motivo) {
        const turno = await this.turnoRepository.findByIdPopulated(turnoId);
        if (!turno) {
            throw new NotFoundError('Turno no encontrado');
        }
        // Usar lógica de dominio
        turno.cancelar(usuarioId, motivo);
        await turno.save();

        // Notificar a la contraparte
        if (await this.medicoRepository.findByUsuario(usuarioId)) {
            // Médico cancela -> notificar al paciente (en su usuario)
            await this.notificacionRepository.save({
                destinatario: turno.paciente.usuario || turno.paciente._id || turno.paciente,
                remitente: usuarioId,
                mensaje: `Tu turno del ${new Date(turno.fechaHora).toLocaleString('es-AR')} fue cancelado por el médico. Motivo: ${motivo}`
            });
        } else if (await this.pacienteRepository.findById(usuarioId)) {
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

    // Aceptar una reserva (médico) -> CONFIRMADO + notificar al paciente
    async aceptarReserva(turnoId, medicoId) {
        const turno = await this.turnoRepository.findByIdPopulated(turnoId);
        if (!turno) {
            throw new NotFoundError('Turno no encontrado');
        }

        const medicoIdTurno = turno.medico._id || turno.medico;
        if (medicoIdTurno.toString() !== medicoId.toString()) {
            throw new BadRequestError('Este turno no pertenece al médico indicado');
        }

        // Lógica de dominio
        turno.aceptar(medicoId);
        await turno.save();

        // Notificar al paciente
        if (turno.paciente) {
            const pacienteUsuario = turno.paciente.usuario || turno.paciente._id || turno.paciente;
            await this.notificacionRepository.save({
                destinatario: pacienteUsuario,
                remitente: medicoId,
                mensaje: `Tu turno del ${new Date(turno.fechaHora).toLocaleString('es-AR')} fue confirmado por el médico.`
            });
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

        // Notificar solo a la contraparte
        const mensaje = `Se ha propuesto un cambio de fecha para tu turno al ${new Date(nuevaFecha).toLocaleString('es-AR')}. Requiere tu confirmación.`;

        const esMedico = await this.medicoRepository.findByUsuario(usuarioId);
        if (esMedico && turno.paciente) {
            // El médico propuso → notificar al paciente
            const destinatarioPaciente = turno.paciente.usuario || turno.paciente._id || turno.paciente;
            await this.notificacionRepository.save({
                destinatario: destinatarioPaciente,
                remitente: usuarioId,
                mensaje
            });
        } else if (turno.medico) {
            // El paciente propuso → notificar al médico
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

    // Agenda completa de un médico (para aceptar/cancelar/marcar realizado)
    async obtenerAgendaMedico(medicoId, estado = null) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) {
            throw new NotFoundError('Médico no encontrado');
        }
        return await this.turnoRepository.findByMedico(medicoId, estado);
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