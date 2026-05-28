import { Notificacion } from '../../domain/Notificacion.js';

describe('Domain - Notificacion', () => {
    it('debe marcar como leida', () => {
        const noti = new Notificacion();
        noti.leida = false;

        noti.marcarComoLeida();

        expect(noti.leida).toBe(true);
        expect(noti.fechaHoraLeida).toBeInstanceOf(Date);
    });

    it('debe lanzar error si ya fue leida', () => {
        const noti = new Notificacion();
        noti.leida = true;

        expect(() => noti.marcarComoLeida()).toThrow('ya fue leída');
    });
});
