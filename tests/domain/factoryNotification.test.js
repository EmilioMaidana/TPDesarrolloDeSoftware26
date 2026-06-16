import { FactoryNotification } from '../../domain/FactoryNotification.js';

describe('Domain - FactoryNotification', () => {
    let factory;

    // Turno de ejemplo donde paciente y medico son entidades con su usuario asociado.
    const turno = {
        estado: 'RESERVADO',
        paciente: { usuario: 'usrPac', nombre: 'Juan' },
        medico: { usuario: 'usrMed' },
        servicio: { nombre: 'Cardiología' }
    };

    beforeEach(() => {
        factory = new FactoryNotification();
    });

    it('al reservar notifica al médico e incluye paciente y servicio', () => {
        const noti = factory.crearSegunTurnoReservado(turno);
        expect(noti.destinatario).toBe('usrMed');
        expect(noti.remitente).toBe('usrPac');
        expect(noti.mensaje).toContain('Juan');
        expect(noti.mensaje).toContain('Cardiología');
        expect(noti.leida).toBe(false);
    });

    it('al aceptar notifica al paciente', () => {
        const noti = factory.crearSegunAceptacion(turno);
        expect(noti.destinatario).toBe('usrPac');
        expect(noti.remitente).toBe('usrMed');
    });

    it('la cancelación del médico notifica al paciente', () => {
        const noti = factory.crearSegunCancelacionMedico(turno);
        expect(noti.destinatario).toBe('usrPac');
    });

    it('la cancelación del paciente notifica al médico', () => {
        const noti = factory.crearSegunCancelacionPaciente(turno);
        expect(noti.destinatario).toBe('usrMed');
    });

    it('los recordatorios van a ambas partes', () => {
        expect(factory.crearRecordatorioPaciente(turno).destinatario).toBe('usrPac');
        expect(factory.crearRecordatorioMedico(turno).destinatario).toBe('usrMed');
    });

    it('crearSegunEstadoTurno elige la notificación correcta según el estado', () => {
        expect(factory.crearSegunEstadoTurno({ ...turno, estado: 'CONFIRMADO' }).destinatario).toBe('usrPac');
        expect(factory.crearSegunEstadoTurno({ ...turno, estado: 'RESERVADO' }).destinatario).toBe('usrMed');
    });
});
