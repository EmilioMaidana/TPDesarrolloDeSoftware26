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
            actualizarDisponibilidad: jest.fn(),
            actualizarDisponibilidadPorId: jest.fn(),
            actualizarDisponibilidadPorIndice: jest.fn()
        };
        mockTurnoRepo = {
            eliminarDisponiblesFuturos: jest.fn(),
            eliminarDisponiblesFuturosPorDisponibilidad: jest.fn(),
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

        it('debe actualizar una disponibilidad especifica sin reemplazar las demas', async () => {
            const disponibilidadActual = {
                _id: 'disp1',
                diaSemana: 'LUNES',
                horaDesde: '08:00',
                horaHasta: '10:00',
                servicio: 'serv1',
                servicioTipo: 'Especialidad'
            };
            const otraDisponibilidad = {
                _id: 'disp2',
                diaSemana: 'MARTES',
                horaDesde: '14:00',
                horaHasta: '16:00',
                servicio: 'serv2',
                servicioTipo: 'Especialidad'
            };
            const disponibilidadNueva = {
                diaSemana: 'LUNES',
                horaDesde: '09:00',
                horaHasta: '11:00',
                servicio: 'serv1',
                servicioTipo: 'Especialidad'
            };
            const disponibilidadActualizada = {
                _id: 'disp1',
                ...disponibilidadNueva
            };

            mockMedicoRepo.findById.mockResolvedValue({
                _id: 'med1',
                usuario: 'usr1',
                disponibilidades: [disponibilidadActual, otraDisponibilidad]
            });
            mockMedicoRepo.actualizarDisponibilidadPorId.mockResolvedValue({
                _id: 'med1',
                usuario: 'usr1',
                disponibilidades: [disponibilidadActualizada, otraDisponibilidad]
            });
            mockServicioRepo.findServicioById.mockResolvedValue({ duracionTurnoEnMins: 30, costoConsulta: 1000 });
            mockTurnoRepo.existeTurnoEnHorario.mockResolvedValue(false);

            const resultado = await disponibilidadService.actualizarDisponibilidadPorId(
                'med1',
                'disp1',
                disponibilidadNueva
            );

            expect(mockMedicoRepo.actualizarDisponibilidadPorId).toHaveBeenCalledWith('med1', 'disp1', disponibilidadNueva);
            expect(mockMedicoRepo.actualizarDisponibilidad).not.toHaveBeenCalled();
            expect(mockTurnoRepo.eliminarDisponiblesFuturosPorDisponibilidad).toHaveBeenCalledWith('med1', disponibilidadActual);
            expect(resultado.disponibilidades).toEqual([disponibilidadActualizada, otraDisponibilidad]);
        });

        it('debe permitir actualizar por indice si la disponibilidad no tiene id', async () => {
            const disponibilidadActual = {
                diaSemana: 'LUNES',
                horaDesde: '08:00',
                horaHasta: '10:00',
                servicio: 'serv1',
                servicioTipo: 'Especialidad'
            };
            const disponibilidadNueva = {
                diaSemana: 'LUNES',
                horaDesde: '09:00',
                horaHasta: '11:00',
                servicio: 'serv1',
                servicioTipo: 'Especialidad'
            };
            const disponibilidadActualizada = {
                _id: 'disp-generada',
                ...disponibilidadNueva
            };

            mockMedicoRepo.findById.mockResolvedValue({
                _id: 'med1',
                usuario: 'usr1',
                disponibilidades: [disponibilidadActual]
            });
            mockMedicoRepo.actualizarDisponibilidadPorIndice.mockResolvedValue({
                _id: 'med1',
                usuario: 'usr1',
                disponibilidades: [disponibilidadActualizada]
            });
            mockServicioRepo.findServicioById.mockResolvedValue({ duracionTurnoEnMins: 30, costoConsulta: 1000 });
            mockTurnoRepo.existeTurnoEnHorario.mockResolvedValue(false);

            await disponibilidadService.actualizarDisponibilidadPorId('med1', '0', disponibilidadNueva);

            expect(mockMedicoRepo.actualizarDisponibilidadPorIndice).toHaveBeenCalledWith('med1', 0, disponibilidadNueva);
            expect(mockMedicoRepo.actualizarDisponibilidadPorId).not.toHaveBeenCalled();
        });
    });
});
