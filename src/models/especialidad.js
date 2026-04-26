export class Especialidad {
    constructor(nombre, duracionTurno, costoConsulta) {
        this.nombre = nombre;
        this.duracionTurnoEnMin = duracionTurno;
        this.costoConsulta = costoConsulta;
    }

    getNombre(){return this.nombre}
}