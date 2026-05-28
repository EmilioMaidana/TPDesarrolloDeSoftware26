import { jest } from '@jest/globals';
import { DisponibilidadService } from '../../service/disponibilidadService.js';

describe('Service - DisponibilidadService', () => {
    let disponibilidadService;
    let mockMedicoRepo;
    let mockTurnoRepo;
    let mockServicioRepo;

    beforeEach(() => {
        mockMedicoRepo = {
            findByIdPopulated: jest.fn(),
            findById: jest.fn(),
            actualizarDisponibilidad: jest.fn()
        };
        mockTurnoRepo = {
            eliminarDisponiblesFuturos: jest.fn(),
            existeTurnoEnHorario: jest.fn(),
            insertMany: jest.fn()
        };
        mockServicioRepo = {
            findServicioById: jest.fn()
        };

        disponibilidadService = new DisponibilidadService(mockMedicoRepo, mockTurnoRepo, mockServicioRepo);
    });

    describe('actualizarDisponibilidad', () => {
        it('debe actualizar disponibilidad y regenerar turnos futuros', async () => {
            const disponibilidades = [
                { diaSemana: 'LUNES', horaDesde: '08:00', horaHasta: '10:00', servicio: 'serv1', servicioTipo: 'Especialidad' }
            ];

            mockMedicoRepo.findById.mockResolvedValue({
                _id: 'med1',
                usuario: 'usr1',
                disponibilidades: disponibilidades
            });

            mockServicioRepo.findServicioById.mockResolvedValue({ duracionTurnoEnMins: 30, costoConsulta: 1000 });
            mockTurnoRepo.existeTurnoEnHorario.mockResolvedValue(false);

            await disponibilidadService.actualizarDisponibilidad('med1', disponibilidades);

            expect(mockMedicoRepo.actualizarDisponibilidad).toHaveBeenCalledWith('med1', disponibilidades);
            expect(mockTurnoRepo.eliminarDisponiblesFuturos).toHaveBeenCalledWith('med1');
            expect(mockTurnoRepo.insertMany).toHaveBeenCalled();
        });
    });
});
