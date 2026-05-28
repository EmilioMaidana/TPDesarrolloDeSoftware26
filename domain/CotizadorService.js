import { NivelCobertura } from './Enums.js';

export class CotizadorService {

    /**
     * Cotiza un turno para un paciente según su plan
     * @param {Object} turno - Turno con servicio populado
     * @param {Object} plan - Plan del paciente con coberturas
     * @returns {{ nivelCobertura, porcentajeCobertura, costoBase, costoFinal }}
     */
    static cotizar(turno, plan) {
        if (!plan) {
            return {
                nivelCobertura: NivelCobertura.NO_CUBIERTA,
                porcentajeCobertura: 0,
                costoBase: turno.costo,
                costoFinal: turno.costo
            };
        }

        const costoBase = turno.costo;
        const servicioId = turno.servicio._id || turno.servicio;
        const servicioTipo = turno.servicioTipo;

        return plan.calcularCosto(costoBase, servicioId, servicioTipo);
    }

    /**
     * Cotiza una lista de turnos para un paciente
     * @param {Array} turnos - Lista de turnos
     * @param {Object} plan - Plan del paciente
     * @returns Array de turnos con info de cotización añadida
     */
    static cotizarMuchos(turnos, plan) {
        return turnos.map(turno => {
            const cotizacion = CotizadorService.cotizar(turno, plan);
            return {
                ...turno.toJSON ? turno.toJSON() : turno,
                cotizacion
            };
        });
    }
}
