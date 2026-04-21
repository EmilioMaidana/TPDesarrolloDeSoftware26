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