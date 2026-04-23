import CambioEstadoTurno from './CambioEstadoTurno.js'

class Turno{
    constructor(id,medico,paciente,fechaHora,sede,practica,estado,historialEstados,costo){
        this.id = id;
        this.medico = medico;
        this.paciente = paciente;
        this.fechaHora = fechaHora;
        this.sede = sede;
        this.practica = practica;
        this.estado = estado;
        this.historialEstados = historialEstados;
        this.costo = costo;
    }
    
    actualizarEstado(nuevoEstado, usuario, motivo) {
        this.estado = nuevoEstado;

        const cambio = new CambioDeEstadoTurno(
            new Date(),
            nuevoEstado,
            this,         //le estoy pasando este mismo turno
            usuario,
            motivo
        );

        this.historialEstados.push(cambio);
    }
    
    notificacionPorFecha(){
        const fechaActual = new Date()
        const fechaRegistrada = fechaHora.setDate(fechaHora.getDate() - 1);
        if(fechaActual === fechaRegistrada){
            this.medico.usuario.confirmarTurno(this);
            this.paciente.usuario.confirmarTurno(this);
        }
    }
}
