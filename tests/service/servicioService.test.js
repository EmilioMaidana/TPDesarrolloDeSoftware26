import { jest } from '@jest/globals';
import { ServicioService } from '../../service/servicioService.js';

describe('Service - ServicioService', () => {
    let servicioService;
    let mockServicioRepo;
    let mockMedicoRepo;

    beforeEach(() => {
        mockServicioRepo = {
            findServicioById: jest.fn(),
        };
        mockMedicoRepo = {
            findById: jest.fn(),
            agregarServicio: jest.fn(),
            quitarServicio: jest.fn()
        };

        servicioService = new ServicioService(mockServicioRepo, mockMedicoRepo);
    });

    describe('altaServicio', () => {
        it('debe lanzar error si el médico ya tiene la especialidad', async () => {
            mockMedicoRepo.findById.mockResolvedValue({ especialidades: ['serv1'] });
            mockServicioRepo.findServicioById.mockResolvedValue({ _id: 'serv1' });

            await expect(servicioService.altaServicio('med1', 'Especialidad', 'serv1'))
                .rejects.toThrow('El médico ya tiene asignada esta especialidad');
        });

        it('debe agregar el servicio si todo es correcto', async () => {
            mockMedicoRepo.findById.mockResolvedValue({ especialidades: ['serv2'] });
            mockServicioRepo.findServicioById.mockResolvedValue({ _id: 'serv1' });

            await servicioService.altaServicio('med1', 'Especialidad', 'serv1');

            expect(mockMedicoRepo.agregarServicio).toHaveBeenCalledWith('med1', 'Especialidad', 'serv1');
        });
    });
});
