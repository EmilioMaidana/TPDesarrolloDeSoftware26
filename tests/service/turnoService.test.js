import { jest } from '@jest/globals';
import { TurnoService } from '../../service/turnoService.js';
import { Turno } from '../../domain/Turno.js';
import { EstadoTurno, NivelCobertura } from '../../domain/Enums.js';
import { Plan } from '../../domain/Plan.js';

describe('Service - TurnoService', () => {
    let turnoService;
    let mockTurnoRepo;
    let mockPacienteRepo;
    let mockMedicoRepo;
    let mockNotificacionRepo;

    beforeEach(() => {
        mockTurnoRepo = {
            buscarDisponibles: jest.fn(),
            findById: jest.fn(),
            findByIdPopulated: jest.fn(),
            save: jest.fn()
        };
        mockPacienteRepo = {
            findByIdConPlan: jest.fn(),
            findById: jest.fn()
        };
        mockMedicoRepo = {
            findById: jest.fn()
        };
        mockNotificacionRepo = {
            save: jest.fn()
        };

        turnoService = new TurnoService(mockTurnoRepo, mockPacienteRepo, mockMedicoRepo, mockNotificacionRepo);
    });

    describe('buscarDisponibles', () => {
        it('debe buscar turnos y cotizarlos según el plan del paciente', async () => {
            const planMock = new Plan();
            planMock.coberturasEspecialidad = [{ especialidad: 'esp1', nivel: NivelCobertura.TOTAL, porcentaje: 100 }];
            
            mockPacienteRepo.findByIdConPlan.mockResolvedValue({ plan: planMock });
            
            mockTurnoRepo.buscarDisponibles.mockResolvedValue({
                turnos: [
                    { _id: '1', costo: 1000, servicio: 'esp1', servicioTipo: 'Especialidad', toJSON: () => ({ id: '1' }) },
                    { _id: '2', costo: 2000, servicio: 'esp2', servicioTipo: 'Especialidad', toJSON: () => ({ id: '2' }) }
                ],
                paginacion: { total: 2 }
            });

            const resultado = await turnoService.buscarDisponibles({}, 'pac1');

            expect(resultado.turnos.length).toBe(2);
            expect(resultado.turnos[0].cotizacion.costoFinal).toBe(0); // Cubierto al 100%
            expect(resultado.turnos[1].cotizacion.costoFinal).toBe(2000); // No cubierto
            expect(mockPacienteRepo.findByIdConPlan).toHaveBeenCalledWith('pac1');
        });
    });

    describe('reservar', () => {
        it('debe reservar un turno y notificar al médico', async () => {
            const turnoMock = new Turno();
            turnoMock.estado = EstadoTurno.DISPONIBLE;
            turnoMock.historialEstados = [];
            turnoMock.medico = 'med1';
            turnoMock.servicio = 'esp1';
            turnoMock.servicioTipo = 'Especialidad';
            turnoMock.costo = 1000;
            turnoMock.fechaHora = new Date();
            turnoMock.save = jest.fn();
            turnoMock.toJSON = () => ({ id: 'turno1' });

            // El service usa findByIdPopulated para traer el turno con el servicio
            mockTurnoRepo.findByIdPopulated.mockResolvedValue(turnoMock);
            // ...y findByIdConPlan para cotizar segun el plan del paciente
            mockPacienteRepo.findByIdConPlan.mockResolvedValue({ _id: 'pac1', nombre: 'Juan', plan: null });
            mockMedicoRepo.findById.mockResolvedValue({ usuario: 'usrMed' });

            await turnoService.reservar('turno1', 'pac1');

            expect(turnoMock.estado).toBe(EstadoTurno.RESERVADO);
            expect(turnoMock.paciente).toBe('pac1');
            expect(turnoMock.save).toHaveBeenCalled();
            expect(mockNotificacionRepo.save).toHaveBeenCalled();
        });
    });

    describe('aceptarReserva', () => {
        it('debe confirmar el turno y notificar al paciente', async () => {
            const turnoMock = new Turno();
            turnoMock.estado = EstadoTurno.RESERVADO;
            turnoMock.historialEstados = [];
            turnoMock.medico = 'med1';
            turnoMock.paciente = { _id: 'pac1', usuario: 'usrPac' };
            turnoMock.fechaHora = new Date();
            turnoMock.save = jest.fn();

            mockTurnoRepo.findByIdPopulated.mockResolvedValue(turnoMock);

            await turnoService.aceptarReserva('turno1', 'med1');

            expect(turnoMock.estado).toBe(EstadoTurno.CONFIRMADO);
            expect(turnoMock.save).toHaveBeenCalled();
            expect(mockNotificacionRepo.save).toHaveBeenCalledWith(
                expect.objectContaining({ destinatario: 'usrPac' })
            );
        });

        it('debe rechazar si el turno no pertenece al médico', async () => {
            const turnoMock = new Turno();
            turnoMock.estado = EstadoTurno.RESERVADO;
            turnoMock.historialEstados = [];
            turnoMock.medico = 'medOtro';

            mockTurnoRepo.findByIdPopulated.mockResolvedValue(turnoMock);

            await expect(turnoService.aceptarReserva('turno1', 'med1')).rejects.toThrow();
        });
    });
});
