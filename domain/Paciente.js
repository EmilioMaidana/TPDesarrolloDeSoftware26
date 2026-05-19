
export class Paciente{
    constructor(usuario,dni,obraSocial,plan, nombre){
        this.usuario = usuario;
        this.dni = dni;
        this.obraSocial = obraSocial;
        this.plan = plan;
        this.turnosRealizados = [];
        this.nombre;
    }

        agregarTurnoRealizado(turno){
            this.turnosRealizados.push(turno);
        }

        consultarTurnosRealizados(){
            return this.turnosRealizados;
        }

        solicitarCambioFecha(turno, nuevaFecha){}

        reservarTurno(){}

        cancelarTurno(turno, motivo){}

        
    //Agrego para comprobar el nombre del paciente
        getNombre(){
            return this.nombre;
        }
}