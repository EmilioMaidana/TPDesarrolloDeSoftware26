
export class Paciente{
    constructor(usuario,dni,obraSocial,plan){
        this.usuario = usuario;
        this.dni = dni;
        this.obraSocial = obraSocial;
        this.plan = plan;
        this.turnosRealizados = [];
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
}