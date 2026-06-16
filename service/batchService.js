import { Agenda } from "../domain/Agenda.js";

export class BatchService {

    constructor(medicoRepository, turnoRepository, servicioRepository, notificacionRepository) {
        this.medicoRepository = medicoRepository;
        this.turnoRepository = turnoRepository;
        this.servicioRepository = servicioRepository;
        this.notificacionRepository = notificacionRepository;
    }

    async generarTurnosParaTodosLosMedicos() {
        const diasAdelante = parseInt(process.env.BATCH_DAYS_AHEAD) || 14;
        const medicos = await this.medicoRepository.findAll();

        let totalGenerados = 0;

        for (const medico of medicos) {
            if (medico.disponibilidades.length === 0) continue;

            // Obtener info de servicios
            const serviciosMap = new Map();
            for (const disp of medico.disponibilidades) {
                const key = disp.servicio.toString();
                if (!serviciosMap.has(key)) {
                    const servicio = await this.servicioRepository.findServicioById(disp.servicioTipo, disp.servicio);
                    if (servicio) {
                        serviciosMap.set(key, {
                            duracionTurnoEnMins: servicio.duracionTurnoEnMins,
                            costoConsulta: servicio.costoConsulta
                        });
                    }
                }
            }

            const nuevosTurnos = Agenda.generarTurnosParaMedico(medico, diasAdelante, serviciosMap);

            // Filtrar turnos que ya existen
            const turnosFiltrados = [];
            for (const turno of nuevosTurnos) {
                const existe = await this.turnoRepository.existeTurnoEnHorario(turno.medico, turno.fechaHora);
                if (!existe) {
                    turnosFiltrados.push(turno);
                }
            }

            if (turnosFiltrados.length > 0) {
                await this.turnoRepository.insertMany(turnosFiltrados);
                totalGenerados += turnosFiltrados.length;
            }

            console.log(`Medico ${medico.nombre}: ${turnosFiltrados.length} turnos generados`);
        }

        console.log(`Total de turnos generados: ${totalGenerados}`);
        return totalGenerados;
    }

    async enviarRecordatorios() {
        const mananaInicio = new Date();
        mananaInicio.setDate(mananaInicio.getDate() + 1);
        mananaInicio.setHours(0, 0, 0, 0);

        const mananaFin = new Date(mananaInicio);
        mananaFin.setHours(23, 59, 59, 999);

        const turnos = await this.turnoRepository.findTurnosParaRecordatorio(mananaInicio, mananaFin);
        let recordatoriosEnviados = 0;

        for (const turno of turnos) {
            const fechaString = new Date(turno.fechaHora).toLocaleString('es-AR');
            
            // Recordatorio al paciente
            if (turno.paciente && turno.paciente.usuario) {
                await this.notificacionRepository.save({
                    destinatario: turno.paciente.usuario,
                    remitente: turno.paciente.usuario, // Sistema
                    mensaje: `Recordatorio: Tienes un turno mañana ${fechaString} en ${turno.sede.nombre}.`
                });
                recordatoriosEnviados++;
            }

            // Recordatorio al médico
            if (turno.medico && turno.medico.usuario) {
                await this.notificacionRepository.save({
                    destinatario: turno.medico.usuario,
                    remitente: turno.medico.usuario, // Sistema
                    mensaje: `Recordatorio: Tienes un turno agendado para mañana ${fechaString} con el paciente ${turno.paciente ? turno.paciente.nombre : 'Desconocido'}.`
                });
                recordatoriosEnviados++;
            }
        }

        console.log(`Total de recordatorios enviados: ${recordatoriosEnviados}`);
        return recordatoriosEnviados;
    }
}
