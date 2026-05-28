import { CotizadorService } from '../../domain/CotizadorService.js';
import { Plan } from '../../domain/Plan.js';
import { NivelCobertura } from '../../domain/Enums.js';

describe('Domain - CotizadorService', () => {
    it('debe cotizar un turno con plan sin cobertura', () => {
        const turno = { costo: 500, servicio: 'esp1', servicioTipo: 'Especialidad' };
        const plan = new Plan();
        plan.coberturasEspecialidad = [];
        plan.coberturasPracticas = [];

        const cotizacion = CotizadorService.cotizar(turno, plan);
        expect(cotizacion.costoFinal).toBe(500);
        expect(cotizacion.nivelCobertura).toBe(NivelCobertura.NO_CUBIERTA);
    });

    it('debe cotizar al 100% si no hay plan (paciente particular)', () => {
        const turno = { costo: 800, servicio: 'esp1', servicioTipo: 'Especialidad' };
        const cotizacion = CotizadorService.cotizar(turno, null);
        expect(cotizacion.costoFinal).toBe(800);
        expect(cotizacion.nivelCobertura).toBe(NivelCobertura.NO_CUBIERTA);
    });

    it('debe cotizar varios turnos', () => {
        const turnos = [
            { id: 1, costo: 1000, servicio: 'esp1', servicioTipo: 'Especialidad' },
            { id: 2, costo: 2000, servicio: 'esp2', servicioTipo: 'Especialidad' }
        ];
        const plan = new Plan();
        plan.coberturasEspecialidad = [
            { especialidad: 'esp1', nivel: NivelCobertura.TOTAL, porcentaje: 100 }
        ];
        plan.coberturasPracticas = [];

        const cotizados = CotizadorService.cotizarMuchos(turnos, plan);
        expect(cotizados.length).toBe(2);
        expect(cotizados[0].cotizacion.costoFinal).toBe(0);
        expect(cotizados[1].cotizacion.costoFinal).toBe(2000);
    });
});
