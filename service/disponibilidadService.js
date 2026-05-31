import { NotFoundError, BadRequestError } from "../errors/AppErrors.js";
import { Agenda } from "../domain/Agenda.js";

export class DisponibilidadService {

    constructor(medicoRepository, turnoRepository, servicioRepository) {
        this.medicoRepository = medicoRepository;
        this.turnoRepository = turnoRepository;
        this.servicioRepository = servicioRepository;
    }
    
    // Crear disponibilidad para un medico
    async crearDisponibilidad(medicoId, disponibilidadData) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) {
            throw new NotFoundError('Medico no encontrado');
        }

        const { diaSemana, horaDesde, horaHasta, servicio, servicioTipo } = disponibilidadData;
        if (!diaSemana || !horaDesde || !horaHasta || !servicio || !servicioTipo) {
            throw new BadRequestError('diaSemana, horaDesde, horaHasta, servicio y servicioTipo son obligatorios');
        }

        const servicioEncontrado = await this.servicioRepository.findServicioById(servicioTipo, servicio);
        if (!servicioEncontrado) {
            throw new NotFoundError('Servicio no encontrado');
        }

        const medicoActualizado = await this.medicoRepository.agregarDisponibilidad(medicoId, disponibilidadData);

        const diasAdelante = parseInt(process.env.BATCH_DAYS_AHEAD) || 14;
        const serviciosMap = new Map();
        serviciosMap.set(servicio.toString(), {
            duracionTurnoEnMins: servicioEncontrado.duracionTurnoEnMins,
            costoConsulta: servicioEncontrado.costoConsulta
        });

        const nuevosTurnos = Agenda.generarTurnosParaMedico(medicoActualizado, diasAdelante, serviciosMap);

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

        return {
            disponibilidades: medicoActualizado.disponibilidades,
            turnosGenerados: turnosFiltrados.length
        };
    }

    // Consultar disponibilidad de un medico
    async consultarDisponibilidad(medicoId, servicioId = null) {
        const medico = await this.medicoRepository.findByIdPopulated(medicoId);
        if (!medico) {
            throw new NotFoundError('Medico no encontrado');
        }

        if (servicioId) {
            return medico.disponibilidades.filter(
                d => d.servicio.toString() === servicioId.toString()
            );
        }

        return medico.disponibilidades;
    }

    // Actualizar disponibilidad de un medico
    async actualizarDisponibilidad(medicoId, nuevasDisponibilidades) {
        /*if (!Array.isArray(nuevasDisponibilidades)) {
            throw new BadRequestError('Se requiere un nuevo horario de disponibilidades');
        }*/

        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) {
            throw new NotFoundError('Medico no encontrado');
        }

        const serviciosMap = new Map();
        for (const disp of nuevasDisponibilidades) {
            const { diaSemana, horaDesde, horaHasta, servicio, servicioTipo } = disp;
            if (!diaSemana || !horaDesde || !horaHasta || !servicio || !servicioTipo) {
                throw new BadRequestError('Cada disponibilidad debe incluir diaSemana, horaDesde, horaHasta, servicio y servicioTipo');
            }

            const key = servicio.toString();
            if (!serviciosMap.has(key)) {
                const servicioEncontrado = await this.servicioRepository.findServicioById(servicioTipo, servicio);
                
                // Opera bien hasta este medico
                if (!servicioEncontrado) {
                    throw new NotFoundError('Servicio no encontrado');
                }

                serviciosMap.set(key, {
                    duracionTurnoEnMins: servicioEncontrado.duracionTurnoEnMins,
                    costoConsulta: servicioEncontrado.costoConsulta
                });
            }
        }

        // Actualizar las disponibilidades del medico
        await this.medicoRepository.actualizarDisponibilidad(medicoId, nuevasDisponibilidades);

        // Eliminar turnos futuros DISPONIBLES y regenerar
        await this.turnoRepository.eliminarDisponiblesFuturos(medicoId);

        // Regenerar turnos con las nuevas disponibilidades
        const medicoActualizado = await this.medicoRepository.findById(medicoId);
        const diasAdelante = parseInt(process.env.BATCH_DAYS_AHEAD) || 14;

        const nuevosTurnos = Agenda.generarTurnosParaMedico(medicoActualizado, diasAdelante, serviciosMap);

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

        return {
            disponibilidades: medicoActualizado.disponibilidades,
            turnosGenerados: turnosFiltrados.length
        };
    }
}
