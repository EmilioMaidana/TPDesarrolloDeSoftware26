import {Turno} from './Turno.js'
import {Agenda} from './Agenda.js'


export class Medico{
    constructor(usuario,matricula,nombre,especialidades = [],practicas = [],sedes = [],disponibilidades = []){    
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

    /*
    agregarEspecialidad(especialidad) {
        this.especialidades.push(especialidad);
    }

    agregarPractica(practica) {
        this.practicas.push(practica);
    }

    agregarSede(sede) {
        this.sedes.push(sede);
    }

    reducirDisponibilidad(unaDisponibilidad){
        this.disponibilidades = this.disponibilidades.filter(
        d => d !== unaDisponibilidad);
    }

    agendarTurno(fechaHora, practica){
        this.reducirDisponibilidad(fechaHora);
        this.agregarPractica(practica);
    }
     */
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