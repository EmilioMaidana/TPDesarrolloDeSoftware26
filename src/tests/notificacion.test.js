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
    const usuarioMedico = new Usuario(2, "Langostini", "1234");
    const usuarioPaciente = new Usuario(1, "Emilio", "password123");
    
    const practicaDePrueba = new Practica("IDK", "idem", 60, 35000);
    const carton = new Plan(1, "Plan Oro", "ninguna", practicaDePrueba);
    const securola = new ObraSocial(1, "superSegu", carton);
    
    const medicoPrueba = new Medico(1, usuarioMedico, 2345678, securola, carton);
    const pacientePrueba = new Paciente(1, usuarioPaciente, 1234567, securola, carton);
    const fondoDeBikini = new Sede(1, "fondoDeBikini", "merluzini 32");
    
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

    test("Debe haber creado una notificacion de cancelación cuando el estado es CANCELADO", () => {
        const factory = new FactoryNotification();
        const notificacion = factory.crearSegunEstadoTurno(turnoPrueba);

        // Verificamos que no sea null y que el mensaje coincida
        expect(notificacion).not.toBeNull();
        expect(notificacion.mensaje).toBe("Su turno a sido cancelado");
    });
});