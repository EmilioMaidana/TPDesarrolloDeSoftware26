import { Agenda } from "../domain/Agenda.js";

export class BatchService {

    constructor(medicoRepository, turnoRepository, servicioRepository) {
        this.medicoRepository = medicoRepository;
        this.turnoRepository = turnoRepository;
        this.servicioRepository = servicioRepository;
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
}
