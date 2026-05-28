export class Notificacion {

    marcarComoLeida() {
        if (this.leida) {
            throw new Error('La notificación ya fue leída');
        }
        this.leida = true;
        this.fechaHoraLeida = new Date();
    }
}