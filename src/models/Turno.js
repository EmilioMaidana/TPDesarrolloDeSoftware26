import { CambioEstadoTurno } from './CambioEstadoTurno.js'
import { Especialidad } from "./especialidad.js";
import { Practica } from "./Practica.js";

export class Turno{
    constructor(medico,paciente,fechaHora,sede,servicio,estado,historialEstados,costo){
        this.medico = medico;
        this.paciente = paciente;
        this.fechaHora = fechaHora;
        this.sede = sede;
        this.servicio = servicio;
        this.estado = estado;
        this.historialEstados = historialEstados;
        this.costo = costo;
    }

    getEstadoTurno(){return this.estado}
    getMedicoTurno(){return this.medico}
    getPacienteTurno(){return this.paciente}
    getFechaTurno(){return this.fechaHora}
    getServicio(){return this.servicio}

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

    getTipoTurno(){
        if((this.servicio) instanceof Especialidad){
            return "turno tipo especialidad";
        }
        if((this.servicio) instanceof Practica){
            return "turno tipo practica";
        }else{
            return "El tipo del turno no se especifico correctamente";
        }
            
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