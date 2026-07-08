export class Medico {

    // Define o actualiza una disponibilidad para un dia de la semana
    definirDisponibilidad(unaDisponibilidad) {
        const yaExiste = this.disponibilidades.findIndex(
            d => d.diaSemana === unaDisponibilidad.diaSemana && 
                 d.servicio.toString() === unaDisponibilidad.servicio.toString()
        );
        if (yaExiste >= 0) {
            this.disponibilidades[yaExiste] = unaDisponibilidad;
        } else {
            this.disponibilidades.push(unaDisponibilidad);
        }
    }

    // Verifica si el médico tiene una especialidad
    verificarEspecialidad(especialidadId) {
        return this.especialidades.some(
            e => e.toString() === especialidadId.toString()
        );
    }

    // Verifica si el médico tiene una práctica
    verificarPractica(practicaId) {
        return this.practicas.some(
            p => p.toString() === practicaId.toString()
        );
    }

    // Obtiene las disponibilidades filtradas por servicio
    obtenerDisponibilidadPorServicio(servicioId) {
        return this.disponibilidades.filter(
            d => d.servicio.toString() === servicioId.toString()
        );
    }

    getNombre() {
        return this.nombre;
    }
}