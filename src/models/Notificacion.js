    export class Notificacion{
        constructor(remitente, destinatario,mensaje, fechaHoraCreacion, fechaHoraLeida,leida){
            this.remitente = remitente;
            this.destinatario = destinatario;
            this.mensaje = mensaje;
            this.fechaHoraCreacion = new Date();
            this.fechaHoraLeida = null;
            this.leida = false;
        }

        marcarComoLeida(){
            if (this.leida) {
            throw new Error("La notificacion ya fue leida");
            }
            
            this.leida = true;
            this.fechaHoraLeida = new Date();
        }
    }