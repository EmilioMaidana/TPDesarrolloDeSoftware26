export class Agenda {
    // Metodo 1: Especifico para especialidades
    //let turnosExistentes = [];

    generarTurnosPorEspecialidad(servicio, medico) {
    return medico.disponibilidad.flatMap(disponibilidad => generarSlotsPorRango(disponibilidad.horaDesde,disponibilidad.horaHasta,servicio.duracion).map(({ inicio }) => new Turno(
            medico, 
            null, 
            inicio, 
            null, 
            servicio, 
            EstadoTurno.DISPONIBLE, 
            null, 
            500, 
            null
        ))
    );
    }
    
    generarTurnosPorEspecialidad(servicio, medico) {
        let turnos = [];
        

        for (let disponibilidad of medico.disponibilidad){
            const slotsTurnosDisponible = generarSlotsPorRango(
                disponibilidad.horaDesde,
                disponibilidad.horaHasta,
                servicio.duracion //Revisar DC
            )
            // Por Dia Semana
            for (let { inicio, fin } of slotsTurnosDisponible) {
            
                // Creamos la instancia pasándole 'inicio' (que va a valer '08:00', '08:30', etc.)
                const turno = new Turno(
                    medico, 
                    null, 
                    inicio, 
                    null, 
                    servicio, 
                    EstadoTurno.DISPONIBLE, 
                    null, 
                    500, 
                    null
                );
            
                turnos.push(turno);
            }
       }
        return turnos;
    }

    // Metodo 2: Especifico para practicas
    generarTurnosPorPractica(practica, medico) {

        let turnos;
        if(medico.verificarPractica(practica)){
            turnos = medico.identificarTurnos();
        }

        console.log(`Generando turnos para la practica '${practica}' con el Dr. ${medico.nombre} ` + turnos + "...");
        // Aqui iria tu logica de creacion
    }
    // Metodo 3: Refrescar disponibilidad
    refrescarTurnosSegunDisponibilidadDe(unMedico) {
        const hoy = new Date();
        

        const eliminarTurnos = turnosExistentes.filter(turno =>
            turno.medico.id === unMedico.id && turno.EstadoTurno === 'DISPONIBLE' && turno.fechaHora > hoy)

        // esto incluye turnos pasados + reservados futuros
        const conservarTurnos = turnosExistentes.filter(turno => !eliminarTurnos.includes(turno))

        // Problema: como generar turnos sin superposicion de horarios
        const nuevosTurnos = [...this.generarTurnosPorEspecialidad(servicio, unMedico)];


        return {
            eliminar: eliminarTurnos,
            conservar: conservarTurnos
            //nuevos: nuevosTurnos
        }

       // turnos = medico.identificarTurnos();
        console.log(`Actualizando la agenda segun la disponibilidad del Dr. ${medico.nombre}` + turnos + "...");
        // Logica para revisar los horarios del medico y habilitar/deshabilitar turnos
    }
    
}




//dejo estas funciones para emplearla despues en la generacion de turnos por slots o duracion


/*

    ///////////////////////////////////////////////////////////////////////////////////////////////
    horaAMinutos = (horaStr) => {
    const [horas, minutos] = horaStr.split(':').map(Number);
     return horas * 60 + minutos;
    };

/**
 * Transforma minutos totales de vuelta a un string "HH:MM"

    minutosAHora = (minutosTotales) => {
    const horas = Math.floor(minutosTotales / 60).toString().padStart(2, '0');
    const minutos = (minutosTotales % 60).toString().padStart(2, '0');
    return `${horas}:${minutos}`;
    };

/*Genera el array de turnos posibles basados en un rango y una duración*/


    /* 
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

    */

/*
    enbaseaslotsgenerados(){
        const turnosGenerados = this.generarSlotsPorRango(this.horaDesde, this.horaHasta, this.duracionTurno);
        return turnosGenerados;
    }
*/