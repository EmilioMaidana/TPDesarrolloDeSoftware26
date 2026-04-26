import CambioEstadoTurno from './CambioEstadoTurno.js'

export class Turno{
    constructor(/*id,*/medico,paciente,fechaHora,sede,practica,estado,historialEstados,costo){
       // this.id = id;
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
    
    /*calcularCosto() {
        const cobertura = this.paciente.plan.obtenerCoberturaPorPractica(this.practica); //falta hacer esa funcion

        if (!cobertura) return this.practica.costo;

        if (cobertura.nivelCobertura === "TOTAL") return 0;

        if (cobertura.nivelCobertura === "PARCIAL") {
            return this.practica.costo * 0.5; // ejemplo
        }

        return this.practica.costo;
    }*/
}