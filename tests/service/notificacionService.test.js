import { jest } from '@jest/globals';
import { NotificacionService } from '../../service/notificacionService.js';
import { Notificacion } from '../../domain/Notificacion.js';

describe('Service - NotificacionService', () => {
    let notificacionService;
    let mockNotiRepo;

    beforeEach(() => {
        mockNotiRepo = {
            findById: jest.fn(),
            marcarComoLeida: jest.fn()
        };
        notificacionService = new NotificacionService(mockNotiRepo);
    });

    describe('marcarComoLeida', () => {
        it('debe marcar como leida usando repositorio', async () => {
            const noti = new Notificacion();
            noti.leida = false;

            mockNotiRepo.findById.mockResolvedValue(noti);

            await notificacionService.marcarComoLeida('noti1');

            expect(mockNotiRepo.marcarComoLeida).toHaveBeenCalledWith('noti1');
        });

        it('debe lanzar error si no existe', async () => {
            mockNotiRepo.findById.mockResolvedValue(null);

            await expect(notificacionService.marcarComoLeida('noti1')).rejects.toThrow('no encontrada');
        });
    });
});
