import { Notificacion } from "./Notificacion.js";
import { Turno } from "./Turno.js";

export class FactoryNotification{ 
    crearSegunEstadoTurno(turno){
        return new Notificacion(turno.getPacienteTurno(),turno.getMedicoTurno(),`Su turno fue ${turno.getEstadoTurno()}`,new Date(),null,false);
    }
    
    //Al reservar un turno, se notifica al médico indicando paciente y servicio solicitado (especialidad o práctica).
    
    crearSegunTurnoReservado(turno){
        return new Notificacion(turno.getPacienteTurno(),turno.getMedicoTurno(),`Tenes un turno por aceptar con el paciente ${turno.getPacienteTurno()} de ${turno.getServicio().getNombre()}`,new Date(),null,false);
    }

    //Al aceptar un turno, se notifica al paciente.

    crearSegunAceptacion(turno){
        return new Notificacion(turno.getMedicoTurno(),turno.getPacienteTurno(),`Tu turno de ${turno.getTipoServicio()} ${turno.getServicio().getNombre()} ha sido ${turno.getEstadoTurno()} por el medico ${turno.getMedicoTurno()}`,new Date(),null,false);
    }
    
    //Ante cancelaciones de turnos, se notifica a la contraparte correspondiente.
    
    crearSegunCancelacionMedico(turno){
        return new Notificacion(turno.getMedicoTurno(),turno.getPacienteTurno(),`Su turno de ${turno.getServicio().getNombre()} fue ${turno.getEstadoTurno()} por el medico ${turno.getMedicoTurno()}`,new Date(),null,false);
    }

    crearSegunCancelacionPaciente(turno){
        return new Notificacion(turno.getPacienteTurno(),turno.getMedicoTurno(),`El paciente ${turno.getPacienteTurno()} cancelo su turno de ${turno.getServicio().getNombre()}`,new Date(),null,false);
    }
    
    //El día previo al turno, se envía un recordatorio tanto al paciente como al médico.
    
    crearSegunFecha(turno){
        const fechaActual = new Date();
        const fechaDelTurno = turno.getFechaTurno();
        
        const fechaAnteriorAlTurno = new Date(fechaDelTurno);
        fechaAnteriorAlTurno.setDate(fechaAnteriorAlTurno.getDate() - 1);
    
        if( (fechaActual.toDateString()) === (fechaAnteriorAlTurno.toDateString())){

            return new Notificacion(turno.getMedicoTurno(),turno.getPacienteTurno(),`${turno.getPacienteTurno()} recorda que mañana tenes un turno con el medico${turno.getMedicoTurno()}`,new Date(),null,false);
        }
    }
}