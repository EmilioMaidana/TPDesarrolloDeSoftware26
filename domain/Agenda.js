export class Agenda {
    // Metodo 1: Especifico para especialidades
    generarTurnosPorEspecialidad(especialidad, medico) {
        let turnos;

        //validar si el medico posee dicha especialidad
        //if(medico.verificarEspecialidad(especialidad)){
        //    turnos = medico.identificarTurnos();
        //}
        //verificar en base a la disponibilidadHoraria que turnos puede asignar
        
        console.log(`Generando turnos de ${especialidad} para el Dr. ${medico.nombre}` + turnos + "...");
        // Aqui iria tu logica de creacion (fechas, horarios, etc.)
        

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
    refrescarTurnosSegunDisponibilidadDe(medico) {
        let turnos;
        turnos = medico.identificarTurnos();
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


    enbaseaslotsgenerados(){
        const turnosGenerados = this.generarSlotsPorRango(this.horaDesde, this.horaHasta, this.duracionTurno);
        return turnosGenerados;
    }
*/