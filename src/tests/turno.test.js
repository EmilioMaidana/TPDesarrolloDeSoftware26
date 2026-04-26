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


describe("Pruebas de Turno", () => {

    // Definimos los objetos necesarios para el test
    const usuarioMedico = new Usuario( "Langostini", "1234");
    const usuarioPaciente = new Usuario( "Emilio", "password123");
    
    const practicaDePrueba = new Practica("IDK", "idem", 60, 35000);
    const carton = new Plan( "Plan Oro", "ninguna", practicaDePrueba);
    const securola = new ObraSocial( "superSegu", carton);
    
    const medicoPrueba = new Medico( usuarioMedico, 2345678, securola, carton);
    const pacientePrueba = new Paciente( usuarioPaciente, 1234567, securola, carton);
    const fondoDeBikini = new Sede( "fondoDeBikini", "merluzini 32");

    const especialidadPrueba = new Especialidad("bartender", 60, 12000);
    
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
    
    test("El servicio del turno es del",()=>{
        expect(turnoPrueba.getTipoTurno()).toBe("turno tipo practica");
    });

});