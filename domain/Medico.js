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

    // UNA DISPONIBILIDAD HORARIA POR DIA DE SEMANA
    definirDisponibilidad(unaDisponibilidad){
        const yaExiste = this.disponibilidades.findIndex(d => d.diaSemana === unaDisponibilidad.diaSemana);
        if (yaExiste >= 0){
        // Si ya tenía horario ese día, lo pisa
        this.disponibilidades[yaExiste] = unaDisponibilidad;
        } else {
        // Si es un día nuevo, lo agrega
        this.disponibilidades.push(unaDisponibilidad);
        }
    }


    getNombre(){
            return this.nombre;
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