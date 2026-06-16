import { Notificacion } from "./Notificacion.js";

/**
 * Fabrica de notificaciones segun el evento del ciclo de vida de un turno.
 * Centraliza el armado del mensaje y resuelve quien es el destinatario y el
 * remitente correcto en cada caso (ver reglas de la Entrega 1).
 */
export class FactoryNotification {

    // Acepta tanto un Usuario directo como una entidad (Paciente/Medico) que lo referencia.
    _usuarioDe(entidad) {
        return entidad && entidad.usuario ? entidad.usuario : entidad;
    }

    _nombreServicio(turno) {
        return turno.servicio && turno.servicio.nombre ? turno.servicio.nombre : "el servicio solicitado";
    }

    _nombrePaciente(turno) {
        return turno.paciente && turno.paciente.nombre ? turno.paciente.nombre : "Un paciente";
    }

    _construir(destinatario, remitente, mensaje) {
        const notificacion = new Notificacion();
        notificacion.destinatario = destinatario;
        notificacion.remitente = remitente;
        notificacion.mensaje = mensaje;
        notificacion.leida = false;
        notificacion.fechaHoraCreacion = new Date();
        return notificacion;
    }

    // Al reservar un turno, se notifica al medico indicando paciente y servicio.
    crearSegunTurnoReservado(turno) {
        return this._construir(
            this._usuarioDe(turno.medico),
            this._usuarioDe(turno.paciente),
            `${this._nombrePaciente(turno)} reservo un turno de ${this._nombreServicio(turno)}.`
        );
    }

    // Al aceptar un turno, se notifica al paciente.
    crearSegunAceptacion(turno) {
        return this._construir(
            this._usuarioDe(turno.paciente),
            this._usuarioDe(turno.medico),
            `Tu turno de ${this._nombreServicio(turno)} fue confirmado por el medico.`
        );
    }

    // Ante cancelaciones, se notifica a la contraparte correspondiente.
    crearSegunCancelacionMedico(turno) {
        return this._construir(
            this._usuarioDe(turno.paciente),
            this._usuarioDe(turno.medico),
            `Tu turno de ${this._nombreServicio(turno)} fue cancelado por el medico.`
        );
    }

    crearSegunCancelacionPaciente(turno) {
        return this._construir(
            this._usuarioDe(turno.medico),
            this._usuarioDe(turno.paciente),
            `${this._nombrePaciente(turno)} cancelo su turno de ${this._nombreServicio(turno)}.`
        );
    }

    // El dia previo al turno, recordatorio tanto al paciente como al medico.
    crearRecordatorioPaciente(turno) {
        return this._construir(
            this._usuarioDe(turno.paciente),
            this._usuarioDe(turno.medico),
            `Recorda que manana tenes un turno de ${this._nombreServicio(turno)}.`
        );
    }

    crearRecordatorioMedico(turno) {
        return this._construir(
            this._usuarioDe(turno.medico),
            this._usuarioDe(turno.paciente),
            `Recorda que manana tenes un turno con ${this._nombrePaciente(turno)}.`
        );
    }

    // Metodo del diagrama: arma la notificacion adecuada segun el estado del turno.
    crearSegunEstadoTurno(turno) {
        switch (turno.estado) {
            case "RESERVADO": return this.crearSegunTurnoReservado(turno);
            case "CONFIRMADO": return this.crearSegunAceptacion(turno);
            case "CANCELADO": return this.crearSegunCancelacionMedico(turno);
            default:
                return this._construir(
                    this._usuarioDe(turno.paciente),
                    this._usuarioDe(turno.medico),
                    `El estado de tu turno cambio a ${turno.estado}.`
                );
        }
    }
}
