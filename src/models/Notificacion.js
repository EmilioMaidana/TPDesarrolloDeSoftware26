    export class Notificacion{
        constructor(remitente, destinatario,mensaje, fechaHoraCreacion, fechaHoraLeida,leida){
            this.remitente = remitente;
            this.destinatario = destinatario;
            this.mensaje = mensaje;
            this.fechaHoraCreacion = fechaHoraCreacion;
            this.fechaHoraLeida = fechaHoraLeida;
            this.leida = leida;
        }

        getRemitente(){ return this.remitente}
        getDestinatario(){ return this.destinatario}
        getMensaje(){return this.mensaje}

        marcarComoLeida(){
            if (this.leida) {
            throw new Error("La notificacion ya fue leida");
            }
            
            this.leida = true;
            this.fechaHoraLeida = new Date();
        }
    }