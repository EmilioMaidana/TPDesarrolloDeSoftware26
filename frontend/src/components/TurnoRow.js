"use client";

import { MapPin } from "lucide-react";
import { formatearMoneda, infoCobertura } from "@/lib/format";
import { HoraArco } from "@/components/ArcoDelDia";

/**
 * Card de resultado en formato "fila" para la lista de búsqueda: la info va a la
 * izquierda y el precio + acciones a la derecha (apilado en mobile).
 */
export function TurnoRow({ turno, acciones }) {
  const cot = turno.cotizacion || {};
  const cobertura = infoCobertura(cot.nivelCobertura);
  const aPagar = cot.costoFinal ?? turno.costo;
  const hayDescuento = aPagar < turno.costo;

  return (
    <article className="card turno-row">
      <div className="turno-row__main">
        <div className="turno-row__head">
          <span className="turno-row__medico">{turno.medico?.nombre || "Profesional"}</span>
          <span className="turno-row__sub">
            · {turno.servicio?.nombre}
            {turno.servicioTipo ? ` · ${turno.servicioTipo}` : ""}
          </span>
        </div>
        <div className="turno-row__meta">
          <HoraArco fecha={turno.fechaHora} conFecha />
          <span className="turno-row__sede">
            <MapPin className="ico" size={15} aria-hidden="true" />
            {turno.sede?.nombre || "Sede a confirmar"}
          </span>
        </div>
        {cot.porcentajeCobertura > 0 && (
          <span className="muted" style={{ fontSize: "0.85rem" }}>
            Tu plan cubre el {cot.porcentajeCobertura}% de esta prestación.
          </span>
        )}
      </div>

      <div className="turno-row__aside">
        <span className={`badge ${cobertura.clase}`}>{cobertura.texto}</span>
        <div className="turno-row__precio">
          <span className="precio-label">Abonás</span>
          <span className="precio-final">{formatearMoneda(aPagar)}</span>
          {hayDescuento && (
            <span className="precio-base">{formatearMoneda(turno.costo)}</span>
          )}
        </div>
        {acciones && <div className="turno-row__acciones">{acciones}</div>}
      </div>
    </article>
  );
}
