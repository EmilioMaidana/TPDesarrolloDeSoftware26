import { EstadoTurno, DiaSemanaNumero } from './Enums.js';

export class Agenda {

    /**
     * Convierte string "HH:MM" a minutos totales desde medianoche
     */
    static horaAMinutos(horaStr) {
        const [horas, minutos] = horaStr.split(':').map(Number);
        return horas * 60 + minutos;
    }

    /**
     * Convierte minutos totales a string "HH:MM"
     */
    static minutosAHora(minutosTotales) {
        const horas = Math.floor(minutosTotales / 60).toString().padStart(2, '0');
        const minutos = (minutosTotales % 60).toString().padStart(2, '0');
        return `${horas}:${minutos}`;
    }

    /**
     * Genera los slots de tiempo para un rango horario y una duración de turno
     * @returns Array de { inicio: "HH:MM", fin: "HH:MM" }
     */
    static generarSlotsPorRango(inicioStr, finStr, duracionMins) {
        const slots = [];
        let tiempoActual = Agenda.horaAMinutos(inicioStr);
        const tiempoFin = Agenda.horaAMinutos(finStr);

        while (tiempoActual + duracionMins <= tiempoFin) {
            slots.push({
                inicio: Agenda.minutosAHora(tiempoActual),
                fin: Agenda.minutosAHora(tiempoActual + duracionMins)
            });
            tiempoActual += duracionMins;
        }

        return slots;
    }

    /**
     * Genera turnos DISPONIBLES para un médico basado en sus disponibilidades
     * @param {Object} medico - Documento del médico con disponibilidades populadas
     * @param {Number} diasAdelante - Cuántos días a futuro generar
     * @param {Map} serviciosMap - Map de servicioId -> { duracionTurnoEnMins, costoConsulta }
     * @returns Array de objetos turno listos para insertar en la BD
     */
    static generarTurnosParaMedico(medico, diasAdelante, serviciosMap) {
        const turnos = [];
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        for (let i = 1; i <= diasAdelante; i++) {
            const fecha = new Date(hoy);
            fecha.setDate(fecha.getDate() + i);
            const diaSemanaJS = fecha.getDay(); // 0=Dom, 1=Lun...

            // Buscar disponibilidades que coincidan con este día
            for (const disponibilidad of medico.disponibilidades) {
                const diaNumero = DiaSemanaNumero[disponibilidad.diaSemana];
                if (diaNumero !== diaSemanaJS) continue;

                const servicioInfo = serviciosMap.get(disponibilidad.servicio.toString());
                if (!servicioInfo) continue;

                const slots = Agenda.generarSlotsPorRango(
                    disponibilidad.horaDesde,
                    disponibilidad.horaHasta,
                    servicioInfo.duracionTurnoEnMins
                );

                // Obtener la sede de la disponibilidad o del médico
                const sede = disponibilidad.sede || (medico.sedes && medico.sedes[0]) || null;

                for (const slot of slots) {
                    const [horaInicio, minInicio] = slot.inicio.split(':').map(Number);
                    const fechaHora = new Date(Date.UTC(
                        fecha.getFullYear(),
                        fecha.getMonth(),
                        fecha.getDate(),
                        horaInicio,
                        minInicio,
                        0,
                        0
                    ));

                    turnos.push({
                        medico: medico._id,
                        fechaHora: fechaHora,
                        sede: sede,
                        servicio: disponibilidad.servicio,
                        servicioTipo: disponibilidad.servicioTipo,
                        estado: EstadoTurno.DISPONIBLE,
                        costo: servicioInfo.costoConsulta,
                        historialEstados: [{
                            fechaHoraDeIngreso: new Date(),
                            estado: EstadoTurno.DISPONIBLE,
                            usuario: medico.usuario,
                            motivo: 'Generación automática de turno'
                        }]
                    });
                }
            }
        }

        return turnos;
    }
}
