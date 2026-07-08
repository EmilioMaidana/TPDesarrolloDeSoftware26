import { Plan } from '../../domain/Plan.js';
import { NivelCobertura } from '../../domain/Enums.js';

describe('Domain - Plan', () => {
    let plan;

    beforeEach(() => {
        plan = new Plan();
        plan.coberturasEspecialidad = [
            { especialidad: 'esp1', nivel: NivelCobertura.TOTAL, porcentaje: 100 },
            { especialidad: 'esp2', nivel: NivelCobertura.PARCIAL, porcentaje: 40 }
        ];
        plan.coberturasPracticas = [
            { practica: 'prac1', nivel: NivelCobertura.TOTAL } // Sin porcentaje explícito
        ];
    });

    describe('calcularCosto', () => {
        it('debe calcular costo 0 para cobertura TOTAL (100%)', () => {
            const resultado = plan.calcularCosto(1000, 'esp1', 'Especialidad');
            expect(resultado.costoFinal).toBe(0);
            expect(resultado.nivelCobertura).toBe(NivelCobertura.TOTAL);
        });

        it('debe calcular costo proporcional para cobertura PARCIAL (ej. 40%)', () => {
            const resultado = plan.calcularCosto(1000, 'esp2', 'Especialidad');
            expect(resultado.costoFinal).toBe(600); // 1000 - 40%
        });

        it('debe usar el fallback de porcentaje si no está definido en cobertura TOTAL', () => {
            const resultado = plan.calcularCosto(1000, 'prac1', 'Practica');
            expect(resultado.costoFinal).toBe(0); // El fallback de TOTAL es 100%
        });

        it('debe calcular costo completo si no hay cobertura', () => {
            const resultado = plan.calcularCosto(1000, 'esp3', 'Especialidad');
            expect(resultado.costoFinal).toBe(1000);
            expect(resultado.nivelCobertura).toBe(NivelCobertura.NO_CUBIERTA);
        });
    });
});
