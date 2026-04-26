import { FactoryNotification } from "../models/FactoryNotification";
import { Turno } from "../models/Turno";
import { Medico } from "../models/Medico";
import { Paciente } from "../models/Paciente";
import { Usuario } from "../models/Usuario"; 
import { ObraSocial } from "../models/ObraSocial";
import { Plan } from "../models/Plan";
import { Sede } from "../models/Sede";
import { Practica } from "../models/Practica";
import { Especialidad } from "../models/especialidad";
import { EstadoTurno } from "../models/Constants";
import { CambioEstadoTurno } from "../models/CambioEstadoTurno";


describe("Pruebas de FactoryNotification", () => {
    // Definimos los objetos necesarios para el test
    const usuarioMedico = new Usuario( "Langostini", "1234");
    const usuarioPaciente = new Usuario( "Emilio", "password123");
    
    const practicaDePrueba = new Practica("IDK", "idem", 60, 35000);
    const carton = new Plan( "Plan Oro", "ninguna", practicaDePrueba);
    const securola = new ObraSocial( "superSegu", carton);
    
    const medicoPrueba = new Medico( usuarioMedico, 2345678, securola, carton);
    const pacientePrueba = new Paciente( usuarioPaciente, 1234567, securola, carton);
    const fondoDeBikini = new Sede( "fondoDeBikini", "merluzini 32");

    const especialidadPrueba = new Especialidad("bartender", 60, 12000)
    
    const turnoPrueba = new Turno(
        medicoPrueba, 
        pacientePrueba, 
        new Date(), 
        fondoDeBikini, 
        practicaDePrueba, 
        EstadoTurno.CANCELADO, 
        [EstadoTurno.CANCELADO], 
        practicaDePrueba.costo
    );

    const turnoPrueba2= new Turno(
        medicoPrueba, 
        pacientePrueba, 
        new Date(), 
        fondoDeBikini, 
        especialidadPrueba, 
        EstadoTurno.DISPONIBLE, 
        [EstadoTurno.DISPONIBLE], 
        practicaDePrueba.costo
    );

    const mañana = new Date(); // Empieza como "hoy"
    mañana.setDate(mañana.getDate() + 1);

    const turnoFechaPosterior= new Turno(
        medicoPrueba, 
        pacientePrueba, 
        mañana, 
        fondoDeBikini, 
        especialidadPrueba, 
        EstadoTurno.DISPONIBLE, 
        [EstadoTurno.DISPONIBLE], 
        practicaDePrueba.costo
    );

    test("Debe haber creado una notificacion de cancelación cuando el estado es CANCELADO", () => {
        const factory = new FactoryNotification();
        const notificacion = factory.crearSegunEstadoTurno(turnoPrueba);

        // Verificamos que no sea null y que el mensaje coincida
        expect(notificacion).not.toBeNull();
        expect(notificacion.mensaje).toBe(`Su turno fue CANCELADO`); 
    });

    test("Debe haber creado una notificacion de disponible cuando el estado es disponible", () => {
        const factory = new FactoryNotification();
        const notificacionDispo = factory.crearSegunEstadoTurno(turnoPrueba2);


        // Verificamos que no sea null y que el mensaje coincida
        expect(notificacionDispo).not.toBeNull();
        expect(notificacionDispo.mensaje).toBe(`Su turno fue DISPONIBLE`); 
    });

    test("En caso de que el paciente cancele el turno que notifique al medico",()=>{const factory = new FactoryNotification();
        const notificacionCanceladoPorPaciente = factory.crearSegunCancelacionPaciente(turnoPrueba);

        expect(notificacionCanceladoPorPaciente).not.toBeNull()

        expect(notificacionCanceladoPorPaciente.mensaje).toBe(`El paciente ${turnoPrueba.getPacienteTurno()} cancelo su turno de ${turnoPrueba.getServicio().getNombre()}`)
        expect(notificacionCanceladoPorPaciente.getDestinatario()).toBe(turnoPrueba.getMedicoTurno())
        expect(notificacionCanceladoPorPaciente.getRemitente()).toBe(turnoPrueba.getPacienteTurno())
    })

    test("El día previo al turno, se envía un recordatorio tanto al paciente como al médico.",()=>{const factory = new FactoryNotification();
        const notificacioncrearSegunFecha = factory.crearSegunFecha(turnoFechaPosterior);

        expect(notificacioncrearSegunFecha).not.toBeNull()

        expect(notificacioncrearSegunFecha.mensaje).toBe(`${turnoFechaPosterior.getPacienteTurno()} recorda que mañana tenes un turno con el medico${turnoFechaPosterior.getMedicoTurno()}`)
        expect(notificacioncrearSegunFecha.getDestinatario()).toBe(turnoFechaPosterior.getPacienteTurno())
        expect(notificacioncrearSegunFecha.getRemitente()).toBe(turnoFechaPosterior.getMedicoTurno())
    })

});

