import { CambioEstadoTurno } from './CambioEstadoTurno.js'
import { Especialidad } from "./especialidad.js";
import { Practica } from "./Practica.js";

export class Turno{
    constructor(medico,paciente,fechaHora,sede,servicio,estado,historialEstados,costo,id){
        this.medico = medico;
        this.paciente = paciente;
        this.fechaHora = fechaHora;
        this.sede = sede;
        this.servicio = servicio;
        this.estado = estado;
        this.historialEstados = historialEstados;
        this.costo = costo;
        this.id = id;
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

    //Agrego para comprobar el nombre del medico y paciente
    getMedico(){
        return this.medico;
    }

    getPaciente(){
        return this.paciente;
    }

    getEstado(){
        return this.estado;
    }
}