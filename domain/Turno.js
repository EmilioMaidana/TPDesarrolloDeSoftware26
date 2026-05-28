import { CambioEstadoTurno } from './CambioEstadoTurno.js';
import { EstadoTurno } from './Enums.js';

export class Turno {

    // Verifica si el turno puede ser cancelado (>= 1 hora de anticipación)
    esCancelable() {
        const ahora = new Date();
        const fechaTurno = new Date(this.fechaHora);
        const diferenciaMs = fechaTurno.getTime() - ahora.getTime();
        const diferenciaHoras = diferenciaMs / (1000 * 60 * 60);
        return diferenciaHoras >= 1;
    }

    // Reservar el turno (solo si está DISPONIBLE)
    reservar(pacienteId, usuarioId) {
        if (this.estado !== EstadoTurno.DISPONIBLE) {
            throw new Error('El turno no está disponible para reservar');
        }
        this.paciente = pacienteId;
        this.estado = EstadoTurno.RESERVADO;
        this.historialEstados.push({
            fechaHoraDeIngreso: new Date(),
            estado: EstadoTurno.RESERVADO,
            usuario: usuarioId,
            motivo: 'Reserva de turno'
        });
    }

    // Cancelar el turno (con validación de anticipación)
    cancelar(usuarioId, motivo) {
        if (!this.esCancelable()) {
            throw new Error('No se puede cancelar el turno con menos de 1 hora de anticipación');
        }
        if (!motivo || motivo.trim() === '') {
            throw new Error('Debe indicar un motivo para la cancelación');
        }
        if (this.estado !== EstadoTurno.RESERVADO && this.estado !== EstadoTurno.CONFIRMADO) {
            throw new Error('Solo se pueden cancelar turnos RESERVADOS o CONFIRMADOS');
        }
        this.estado = EstadoTurno.CANCELADO;
        this.motivoCancelacion = motivo;
        this.historialEstados.push({
            fechaHoraDeIngreso: new Date(),
            estado: EstadoTurno.CANCELADO,
            usuario: usuarioId,
            motivo: motivo
        });
    }

    // Marcar como realizado (solo médico)
    marcarRealizado(usuarioId) {
        if (this.estado !== EstadoTurno.RESERVADO && this.estado !== EstadoTurno.CONFIRMADO) {
            throw new Error('Solo se pueden marcar como realizados turnos RESERVADOS o CONFIRMADOS');
        }
        this.estado = EstadoTurno.REALIZADO;
        this.historialEstados.push({
            fechaHoraDeIngreso: new Date(),
            estado: EstadoTurno.REALIZADO,
            usuario: usuarioId,
            motivo: 'Turno realizado'
        });
    }

    // Proponer reprogramación de fecha
    proponerCambioFecha(nuevaFecha, usuarioId) {
        if (this.estado !== EstadoTurno.RESERVADO) {
            throw new Error('Solo se pueden reprogramar turnos RESERVADOS');
        }
        this.fechaPropuesta = nuevaFecha;
        this.estado = EstadoTurno.PENDIENTE_CONFIRMACION;
        this.historialEstados.push({
            fechaHoraDeIngreso: new Date(),
            estado: EstadoTurno.PENDIENTE_CONFIRMACION,
            usuario: usuarioId,
            motivo: `Propuesta de cambio de fecha a ${nuevaFecha}`
        });
    }

    // Confirmar reprogramación
    confirmarCambioFecha(usuarioId) {
        if (this.estado !== EstadoTurno.PENDIENTE_CONFIRMACION) {
            throw new Error('No hay una reprogramación pendiente de confirmación');
        }
        if (!this.fechaPropuesta) {
            throw new Error('No hay fecha propuesta para confirmar');
        }
        this.fechaHora = this.fechaPropuesta;
        this.fechaPropuesta = null;
        this.estado = EstadoTurno.RESERVADO;
        this.historialEstados.push({
            fechaHoraDeIngreso: new Date(),
            estado: EstadoTurno.RESERVADO,
            usuario: usuarioId,
            motivo: 'Reprogramación confirmada'
        });
    }

    // Rechazar reprogramación
    rechazarCambioFecha(usuarioId) {
        if (this.estado !== EstadoTurno.PENDIENTE_CONFIRMACION) {
            throw new Error('No hay una reprogramación pendiente');
        }
        this.fechaPropuesta = null;
        this.estado = EstadoTurno.RESERVADO;
        this.historialEstados.push({
            fechaHoraDeIngreso: new Date(),
            estado: EstadoTurno.RESERVADO,
            usuario: usuarioId,
            motivo: 'Reprogramación rechazada'
        });
    }
}