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
    
    definirDisponibilidad(horaDeInicio, horaDeFin, duracionTurno){
        const turnosGenerados = this.generarSlotsPorRango(horaDeInicio, horaDeFin, duracionTurno);
        
        this.disponibilidades.push(disponibilidad);
    }

    // utils/generarSlots.js

/**
 * Transforma un string "HH:MM" en minutos totales desde el inicio del día
 */
    horaAMinutos = (horaStr) => {
    const [horas, minutos] = horaStr.split(':').map(Number);
     return horas * 60 + minutos;
    };

/**
 * Transforma minutos totales de vuelta a un string "HH:MM"
 */
    minutosAHora = (minutosTotales) => {
    const horas = Math.floor(minutosTotales / 60).toString().padStart(2, '0');
    const minutos = (minutosTotales % 60).toString().padStart(2, '0');
    return `${horas}:${minutos}`;
    };

/**
 * Genera el array de turnos posibles basados en un rango y una duración
 */
    generarSlotsPorRango = (inicioStr, finStr, duracion) => {
    const slots = [];
    let tiempoActual = horaAMinutos(inicioStr);
    const tiempoFin = horaAMinutos(finStr);

    while (tiempoActual + duracion <= tiempoFin) {
        slots.push({
        inicio: minutosAHora(tiempoActual),
        fin: minutosAHora(tiempoActual + duracion)
    });
    tiempoActual += duracion; // Saltamos al siguiente bloque
    }

    return slots;
    };

// Ejemplo de uso:
    rangoEjemplo = { inicio: "08:00", fin: "10:00" };
    turnosDe30Min = generarSlotsPorRango(rangoEjemplo.inicio, rangoEjemplo.fin, 30);

    console.log(turnosDe30Min);
/* 

Salida:
[
  { inicio: '08:00', fin: '08:30' },
  { inicio: '08:30', fin: '09:00' },
  { inicio: '09:00', fin: '09:30' },
  { inicio: '09:30', fin: '10:00' }
]
*/
    
    //Agrego para comprobar el nombre del medico
    getNombre(){
            return this.nombre;
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