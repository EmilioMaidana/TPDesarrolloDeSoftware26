import { Agenda } from '../../domain/Agenda.js';
import { EstadoTurno, DiaSemana } from '../../domain/Enums.js';

describe('Domain - Agenda', () => {
    describe('horaAMinutos', () => {
        it('debe convertir HH:MM a minutos correctamente', () => {
            expect(Agenda.horaAMinutos('08:30')).toBe(510);
            expect(Agenda.horaAMinutos('14:00')).toBe(840);
        });
    });

    describe('generarSlotsPorRango', () => {
        it('debe generar slots de 30 mins', () => {
            const slots = Agenda.generarSlotsPorRango('08:00', '09:00', 30);
            expect(slots.length).toBe(2);
            expect(slots[0].inicio).toBe('08:00');
            expect(slots[0].fin).toBe('08:30');
            expect(slots[1].inicio).toBe('08:30');
            expect(slots[1].fin).toBe('09:00');
        });
    });

    describe('generarTurnosParaMedico', () => {
        it('debe generar turnos según disponibilidad', () => {
            const hoy = new Date();
            hoy.setDate(hoy.getDate() + 1); // Mañana
            const diaSemanaNombre = Object.keys(DiaSemana)[hoy.getDay() === 0 ? 6 : hoy.getDay() - 1]; // Ajuste chapucero para el test, mejor mockeamos

            const medico = {
                _id: 'med1',
                usuario: 'usr1',
                disponibilidades: [
                    {
                        diaSemana: 'LUNES', // Asumamos que mañana es lunes para test simplificado
                        horaDesde: '08:00',
                        horaHasta: '09:00',
                        servicio: 'serv1',
                        servicioTipo: 'Especialidad'
                    }
                ]
            };

            const serviciosMap = new Map();
            serviciosMap.set('serv1', { duracionTurnoEnMins: 30, costoConsulta: 1000 });

            // Forzar que el día de mañana coincida con LUNES en el test es complejo, 
            // así que probamos la estructura del retorno llamando a la función 
            // y asumiendo que durante los próximos 7 días habrá al menos un lunes.
            const turnos = Agenda.generarTurnosParaMedico(medico, 7, serviciosMap);
            
            expect(turnos.length).toBe(2); // 08:00-08:30 y 08:30-09:00
            expect(turnos[0].estado).toBe(EstadoTurno.DISPONIBLE);
            expect(turnos[0].costo).toBe(1000);
            expect(turnos[0].medico).toBe('med1');
        });
    });
});
