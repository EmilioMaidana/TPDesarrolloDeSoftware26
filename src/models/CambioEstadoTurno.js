import {Turno} from './Turno.js';


export class CambioEstadoTurno{
    constructor (fechaHoraDeIngreso,estado,turno,usuario,motivo){
        this.fechaHoraDeIngreso = fechaHoraDeIngreso;
        this.estado = estado;
        this.turno = turno;
        this.usuario = usuario;
        this.motivo = motivo;
    }
}
