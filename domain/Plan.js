import { NivelCobertura } from './Enums.js';

export class Plan {

    _normalizarId(referencia) {
        return (referencia && referencia._id ? referencia._id : referencia).toString();
    }

    obtenerCoberturaPorEspecialidad(especialidadId) {
        const idBuscado = this._normalizarId(especialidadId);
        const cobertura = this.coberturasEspecialidad.find(
            c => this._normalizarId(c.especialidad) === idBuscado
        );
        if (!cobertura) {
            return { nivel: NivelCobertura.NO_CUBIERTA, porcentaje: 0 };
        }
        // Soporta tanto 'porcentaje' (schema) como 'porcentajeCobertura' (datos MongoDB legacy)
        const porcentaje = cobertura.porcentaje ?? cobertura.porcentajeCobertura ?? this._porcentajePorNivel(cobertura.nivel);
        const nivel = cobertura.nivel ?? this._nivelPorPorcentaje(porcentaje);
        return { nivel, porcentaje };
    }

    obtenerCoberturaPorPractica(practicaId) {
        const idBuscado = this._normalizarId(practicaId);
        const cobertura = this.coberturasPracticas.find(
            c => this._normalizarId(c.practica) === idBuscado
        );
        if (!cobertura) {
            return { nivel: NivelCobertura.NO_CUBIERTA, porcentaje: 0 };
        }
        // Soporta tanto 'porcentaje' (schema) como 'porcentajeCobertura' (datos MongoDB legacy)
        const porcentaje = cobertura.porcentaje ?? cobertura.porcentajeCobertura ?? this._porcentajePorNivel(cobertura.nivel);
        const nivel = cobertura.nivel ?? this._nivelPorPorcentaje(porcentaje);
        return { nivel, porcentaje };
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

    // Infiere el nivel de cobertura a partir del porcentaje (para datos legacy sin campo 'nivel')
    _nivelPorPorcentaje(porcentaje) {
        if (porcentaje === null || porcentaje === undefined || porcentaje === 0) return NivelCobertura.NO_CUBIERTA;
        if (porcentaje >= 100) return NivelCobertura.TOTAL;
        return NivelCobertura.PARCIAL;
    }
}
