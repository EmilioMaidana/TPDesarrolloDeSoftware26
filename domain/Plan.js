import { NivelCobertura } from './Enums.js';

export class Plan {

    obtenerCoberturaPorEspecialidad(especialidadId) {
        const cobertura = this.coberturasEspecialidad.find(
            c => c.especialidad.toString() === especialidadId.toString()
        );
        if (!cobertura) {
            return { nivel: NivelCobertura.NO_CUBIERTA, porcentaje: 0 };
        }
        return { nivel: cobertura.nivel, porcentaje: cobertura.porcentaje || this._porcentajePorNivel(cobertura.nivel) };
    }

    obtenerCoberturaPorPractica(practicaId) {
        const cobertura = this.coberturasPracticas.find(
            c => c.practica.toString() === practicaId.toString()
        );
        if (!cobertura) {
            return { nivel: NivelCobertura.NO_CUBIERTA, porcentaje: 0 };
        }
        return { nivel: cobertura.nivel, porcentaje: cobertura.porcentaje || this._porcentajePorNivel(cobertura.nivel) };
    }

    // Calcula el costo final dado un servicio y su tipo
    calcularCosto(costoBase, servicioId, servicioTipo) {
        let cobertura;
        if (servicioTipo === 'Especialidad') {
            cobertura = this.obtenerCoberturaPorEspecialidad(servicioId);
        } else {
            cobertura = this.obtenerCoberturaPorPractica(servicioId);
        }

        const porcentajeCobertura = cobertura.porcentaje;
        const costoFinal = costoBase * (1 - porcentajeCobertura / 100);

        return {
            nivelCobertura: cobertura.nivel,
            porcentajeCobertura,
            costoBase,
            costoFinal: Math.round(costoFinal * 100) / 100
        };
    }

    // Fallback si el porcentaje no está definido en la cobertura
    _porcentajePorNivel(nivel) {
        switch (nivel) {
            case NivelCobertura.TOTAL: return 100;
            case NivelCobertura.PARCIAL: return 50;
            case NivelCobertura.NO_CUBIERTA: return 0;
            default: return 0;
        }
    }
}