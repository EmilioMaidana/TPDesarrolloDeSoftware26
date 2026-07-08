import { jest } from '@jest/globals';
import { Turno } from '../../domain/Turno.js';
import { EstadoTurno } from '../../domain/Enums.js';

describe('Domain - Turno', () => {
    let turno;

    beforeEach(() => {
        turno = new Turno();
        turno.historialEstados = [];
        turno.estado = EstadoTurno.DISPONIBLE;
    });

    describe('esCancelable', () => {
        it('debe retornar true si falta más de 1 hora para el turno', () => {
            const fechaFutura = new Date();
            fechaFutura.setHours(fechaFutura.getHours() + 2);
            turno.fechaHora = fechaFutura;

            expect(turno.esCancelable()).toBe(true);
        });

        it('debe retornar false si falta menos de 1 hora para el turno', () => {
            const fechaFutura = new Date();
            fechaFutura.setMinutes(fechaFutura.getMinutes() + 30);
            turno.fechaHora = fechaFutura;

            expect(turno.esCancelable()).toBe(false);
        });
    });

    describe('reservar', () => {
        it('debe cambiar el estado a RESERVADO si está DISPONIBLE', () => {
            turno.reservar('paciente123', 'paciente123');
            expect(turno.estado).toBe(EstadoTurno.RESERVADO);
            expect(turno.paciente).toBe('paciente123');
            expect(turno.historialEstados.length).toBe(1);
        });

        it('debe lanzar error si no está DISPONIBLE', () => {
            turno.estado = EstadoTurno.RESERVADO;
            expect(() => turno.reservar('paciente123', 'paciente123')).toThrow('El turno no está disponible');
        });
    });

    describe('cancelar', () => {
        it('debe cancelar si cumple las condiciones', () => {
            turno.estado = EstadoTurno.RESERVADO;
            const fechaFutura = new Date();
            fechaFutura.setHours(fechaFutura.getHours() + 2);
            turno.fechaHora = fechaFutura;

            turno.cancelar('usuario1', 'Motivo válido');
            
            expect(turno.estado).toBe(EstadoTurno.CANCELADO);
            expect(turno.motivoCancelacion).toBe('Motivo válido');
        });

        it('debe lanzar error sin motivo', () => {
            turno.estado = EstadoTurno.RESERVADO;
            const fechaFutura = new Date();
            fechaFutura.setHours(fechaFutura.getHours() + 2);
            turno.fechaHora = fechaFutura;

            expect(() => turno.cancelar('usuario1', '')).toThrow('motivo');
        });

        it('debe lanzar error si no es cancelable por tiempo', () => {
            turno.estado = EstadoTurno.RESERVADO;
            const fechaCercana = new Date();
            fechaCercana.setMinutes(fechaCercana.getMinutes() + 30);
            turno.fechaHora = fechaCercana;

            expect(() => turno.cancelar('usuario1', 'Motivo')).toThrow('1 hora');
        });
    });
});
