import { Notificacion } from "./Notificacion.js";
import { Turno } from "./Turno.js";

export class FactoryNotification{ 
    crearSegunEstadoTurno(turno){
        return new Notificacion(turno.paciente, turno.medico,`Su turno fue ${turno.estado}`);
    }
    
    //Al reservar un turno, se notifica al médico indicando paciente y servicio solicitado (especialidad o práctica).
    
    crearSegunTurnoReservado(turno){
        return new Notificacion(turno.paciente, turno.medico,`Tenes un turno por aceptar con el paciente ${turno.paciente} de ${turno.servicio.nombre}`);
    }

    //Al aceptar un turno, se notifica al paciente.

    crearSegunAceptacion(turno){
        return new Notificacion(turno.medico, turno.paciente, `Tu turno de ${turno.servicio.nombre} ha sido ${turno.estado} por el medico ${turno.medico}`);
    }
    
    //Ante cancelaciones de turnos, se notifica a la contraparte correspondiente.
    
    crearSegunCancelacionMedico(turno){
        return new Notificacion(turno.medico, turno.paciente,`Su turno de ${turno.servicio.nombre} fue ${turno.estado} por el medico ${turno.medico}`);
    }

    crearSegunCancelacionPaciente(turno){
        return new Notificacion(turno.paciente, turno.medico,`El paciente ${turno.paciente} cancelo su turno de ${turno.servicio.nombre}`);
    }
    
    //El día previo al turno, se envía un recordatorio tanto al paciente como al médico.
    
    crearRecordatorioMedico(turno){
       return new Notificacion("sistema", turno.paciente,`${turno.paciente} recorda que mañana tenes un turno con el medico${turno.medico}`);  
    }

    crearRecordatorioPaciente(turno){
       return new Notificacion("sistema", turno.medico,`${turno.medico} recorda que mañana tenes un turno con el paciente${turno.paciente}`);  
    }

    /*
    const fechaActual = new Date();
        const fechaDelTurno = turno.getFechaTurno();
        
        const fechaAnteriorAlTurno = new Date(fechaDelTurno);
        fechaAnteriorAlTurno.setDate(fechaAnteriorAlTurno.getDate() - 1);
    
        if( (fechaActual.toDateString()) === (fechaAnteriorAlTurno.toDateString())){
        }
    */
}