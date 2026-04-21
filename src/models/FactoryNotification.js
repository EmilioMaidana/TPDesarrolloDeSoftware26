export class FactoryNotification{ 
    crearSegunEstadoTurno(turno) {

        switch(turno.estado){
            case  "RESERVADO":
                if (turno.practica != NULL){
                return new Notificacion(1,turno.paciente,turno.medico,"Nuevo turno reservado "+turno.especialidad,new Date(),null,false);
                }else
                    return new Notificacion(1,turno.paciente,turno.medico,"Nuevo turno reservado "+turno.practica,new Date(),null,false);

            case "CANCELADO":
                if(medicocancelaturno)
                    return new Notificacion(1,turno.medico,turno.paciente,"Su turno a sido cancelado",new Date(),null,false);
                else{
                    if(pacientecancelaturno)
                        return new Notificacion(1,turno.paciente,turno.medico,"Su turno a sido cancelado",new Date(),null,false);
                }
            
            case "CONFIRMADO":
                return new Notificacion(1,turno.medico,turno.paciente,"Su turno a sido CONFIRMADO",new Date(),null,false);

            default:
                return null;
        }
    } 
}