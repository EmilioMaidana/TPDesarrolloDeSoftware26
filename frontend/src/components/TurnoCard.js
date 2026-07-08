"use client";

import {
  formatearMoneda,
  formatearFecha,
  formatearHora,
  infoCobertura,
} from "@/lib/format";

/**
 * Tarjeta de un turno disponible en la búsqueda. Muestra profesional, servicio,
 * fecha/hora/sede, estado, nivel de cobertura y el monto a abonar según el plan.
 * Las acciones (agregar a preselección / reservar) se pasan por prop.
 */
export function TurnoCard({ turno, acciones }) {
  const cot = turno.cotizacion || {};
  const cobertura = infoCobertura(cot.nivelCobertura);
  const aPagar = cot.costoFinal ?? turno.costo;
  const hayDescuento = aPagar < turno.costo;

  return (
    <article className="card turno-card">
      <div className="turno-card__top">
        <div>
          <div className="turno-card__medico">{turno.medico?.nombre || "Profesional"}</div>
          <div className="turno-card__sub">
            {turno.servicio?.nombre}
            {turno.servicioTipo ? ` · ${turno.servicioTipo}` : ""}
          </div>
        </div>
        <span className={`badge ${cobertura.clase}`}>{cobertura.texto}</span>
      </div>

      <div className="turno-card__meta">
        <span>
          <span className="ico" aria-hidden="true">📅</span>
          {formatearFecha(turno.fechaHora)} · {formatearHora(turno.fechaHora)} hs
        </span>
        <span>
          <span className="ico" aria-hidden="true">📍</span>
          {turno.sede?.nombre || "Sede a confirmar"}
          {turno.sede?.direccion ? ` — ${turno.sede.direccion}` : ""}
        </span>
        {cot.porcentajeCobertura > 0 && (
          <span className="muted" style={{ fontSize: "0.85rem" }}>
            Tu plan cubre el {cot.porcentajeCobertura}% de esta prestación.
          </span>
        )}
      </div>

      <div className="turno-card__precio">
        <div>
          <span className="precio-label">Abonás</span>
          <div>
            <span className="precio-final">{formatearMoneda(aPagar)}</span>
            {hayDescuento && (
              <span className="precio-base">{formatearMoneda(turno.costo)}</span>
            )}
          </div>
        </div>
      </div>

      {acciones && <div className="row">{acciones}</div>}
    </article>
  );
}
