class Usuario{
    constructor(id,nombreUsuario,password, avisos = []){
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.password = password;
        this.avisos = avisos;
    }
    
    cancelarTurno(turno, destinatario){
        turno.estado = CANCELADO;
        const notificacion = crearSegunEstadoTurno(turno);

        if(destinatario === notificacion.medico){
            notificarPaciente(turno,notificacion)
        }else{
            notificarMedico(turno,notificacion);
        }
        //destinatario.usuario.avisos.push(notificacion);
        //destinatario.recibirNotificacion(noti);
    }

    reservarTurno(turno){
        turno.estado = RESERVADO;
        const notificacion = crearSegunEstadoTurno(turno);
        notificarMedico(turno,notificacion);
    }

    confirmarTurno(turno){
        turno.estado = CONFIRMADO;
        const notificacion = crearSegunEstadoTurno(turno);
        notificarPaciente(turno,notificacion);
    }

    notificarMedico(turno,notificacion){
        turno.medico.usuario.avisos.push(notificacion);
    }

    notificarPaciente(turno,notificacion){
        turno.paciente.usuario.avisos.push(notificacion);
    }

}
