export class Plan{
    constructor(id, nombre, coberturasEspecialidad, coberturasPractica){
        this.id = id;
        this.nombre = nombre;
        this.coberturasEspecialidad = coberturasEspecialidad;
        this.coberturasPractica = coberturasPractica;
    }

    obtenerCoberturaPorEspecialidad(especialidad) {
    const cobertura = this.coberturasEspecialidad.find(
        c => c.especialidad === especialidad
    );

    if (!cobertura) {
        return "NO_CUBIERTA";
    }

    return cobertura.nivel; //falta
}

    obtenerCoberturaPorPractica(practica) {
    const cobertura = this.coberturasPractica.find(
        c => c.practica === practica
    );

    if (!cobertura) {
        return "NO_CUBIERTA";
    }

    return cobertura.nivelCobertura; //falta
}
}