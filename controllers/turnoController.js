export class TurnoController {

    constructor(turnoService) {
        this.turnoService = turnoService;
    }

    // GET /api/turnos/disponibles?pacienteId=...&medicoId=...&especialidadId=...&practicaId=...&sede=...&fechaInicio=...&fechaFin=...&page=1&limit=10&sortBy=fechaHora&order=asc
    async buscarDisponibles(req, res, next) {
        try {
            const { pacienteId, medicoId, especialidadId, practicaId, sede, fechaInicio, fechaFin, page, limit, sortBy, order } = req.query;

            if (!pacienteId) {
                return res.status(400).json({ message: 'El parámetro pacienteId es obligatorio' });
            }

            const filtros = { medicoId, especialidadId, practicaId, sede, fechaInicio, fechaFin };
            const resultado = await this.turnoService.buscarDisponibles(
                filtros,
                pacienteId,
                parseInt(page) || 1,
                parseInt(limit) || 10,
                sortBy || 'fechaHora',
                order || 'asc'
            );

            res.json(resultado);
        } catch (error) {
            next(error);
        }
    }

    // GET /api/turnos/:id
    async obtenerPorId(req, res, next) {
        try {
            const turno = await this.turnoService.obtenerPorId(req.params.id);
            res.json(turno);
        } catch (error) {
            next(error);
        }
    }

    // POST /api/turnos/:id/reservar?pacienteId=...
    async reservar(req, res, next) {
        try {
            const { pacienteId } = req.query;
            if (!pacienteId) {
                return res.status(400).json({ message: 'El parámetro pacienteId es obligatorio' });
            }
            const turno = await this.turnoService.reservar(req.params.id, pacienteId);
            res.json({ message: 'Turno reservado exitosamente', turno });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/turnos/:id/cancelar?usuarioId=...&esMedico=false
    async cancelar(req, res, next) {
        try {
            const { usuarioId, esMedico } = req.query;
            const { motivo } = req.body;
            if (!usuarioId) {
                return res.status(400).json({ message: 'El parámetro usuarioId es obligatorio' });
            }
            if (!motivo) {
                return res.status(400).json({ message: 'El motivo es obligatorio' });
            }
            const turno = await this.turnoService.cancelar(req.params.id, usuarioId, motivo, esMedico === 'true');
            res.json({ message: 'Turno cancelado exitosamente', turno });
        } catch (error) {
            next(error);
        }
    }

    // PATCH /api/turnos/:id/reprogramar?usuarioId=...
    async reprogramar(req, res, next) {
        try {
            const { usuarioId } = req.query;
            const { nuevaFecha } = req.body;
            if (!usuarioId || !nuevaFecha) {
                return res.status(400).json({ message: 'usuarioId y nuevaFecha son obligatorios' });
            }
            const turno = await this.turnoService.proponerReprogramacion(req.params.id, nuevaFecha, usuarioId);
            res.json({ message: 'Propuesta de reprogramación enviada', turno });
        } catch (error) {
            next(error);
        }
    }

    // PATCH /api/turnos/:id/confirmar-reprogramacion?usuarioId=...
    async confirmarReprogramacion(req, res, next) {
        try {
            const { usuarioId } = req.query;
            if (!usuarioId) {
                return res.status(400).json({ message: 'El parámetro usuarioId es obligatorio' });
            }
            const turno = await this.turnoService.confirmarReprogramacion(req.params.id, usuarioId);
            res.json({ message: 'Reprogramación confirmada', turno });
        } catch (error) {
            next(error);
        }
    }

    // PATCH /api/turnos/:id/realizado?medicoId=...
    async marcarRealizado(req, res, next) {
        try {
            const { medicoId } = req.query;
            if (!medicoId) {
                return res.status(400).json({ message: 'El parámetro medicoId es obligatorio' });
            }
            const turno = await this.turnoService.marcarRealizado(req.params.id, medicoId);
            res.json({ message: 'Turno marcado como realizado', turno });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/turnos/historial/paciente/:pacienteId
    async historialPaciente(req, res, next) {
        try {
            const turnos = await this.turnoService.obtenerHistorialPaciente(req.params.pacienteId);
            res.json(turnos);
        } catch (error) {
            next(error);
        }
    }

    // GET /api/turnos/historial/medico/:medicoId/paciente/:pacienteId
    async historialPacienteParaMedico(req, res, next) {
        try {
            const turnos = await this.turnoService.obtenerHistorialPacienteParaMedico(
                req.params.medicoId,
                req.params.pacienteId
            );
            res.json(turnos);
        } catch (error) {
            next(error);
        }
    }
}