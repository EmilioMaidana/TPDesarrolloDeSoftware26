class Notificacion{
    constructor(id, remitente, destinatario,mensaje, fechaHoraCreacion, fechaHoraLeida,leida){
        this.id = id;
        this.remitente = remitente;
        this.destinatario = destinatario;
        this.mensaje = mensaje;
        this.fechaHoraCreacion = fechaHoraCreacion;
        this.fechaHoraLeida = fechaHoraLeida;
        this.leida = leida;
    }

    marcarComoLeida(){
        if (this.leida) {
        throw new Error("La notificacion ya fue leida");
        }
        
        this.leida = true;
        this.fechaHoraLeida = new Date();
    }
}