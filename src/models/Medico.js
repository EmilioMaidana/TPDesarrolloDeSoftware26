import {Turno} from './Turno.js'
import {Agenda} from './Agenda.js'

export class Medico{
    constructor(id,usuario,matricula,nombre,especialidades = [],practicas = [],sedes = [],disponibilidades = []){    
        this.id = id;
        this.usuario = usuario;
        this.matricula = matricula;
        this.nombre = nombre;
        this.especialidades = especialidades;
        this.practicas = practicas;
        this.sedes = sedes;
        this.disponibilidades = disponibilidades;
    }
    
    definirDisponibilidad(disponibilidad){
        this.disponibilidades.push(disponibilidad);
    }

    verificarEspecialidad(unaEspecialidad){
        this.especialidades.contains(unaEspecialidad);
    }

    verificarPractica(unaPractica){
        this.especialidades.contains(unaPractica);
    }

    identificarTurnos(){
        return this.disponibilidades;
    }

    eliminarDisponibilidad(turno){
        this.especialidades.delete(turno.date);
    }
    
}
