"use client";

import { MapPin } from "lucide-react";
import { formatearMoneda, infoCobertura } from "@/lib/format";
import { HoraArco } from "@/components/ArcoDelDia";

/**
 * Tarjeta de un turno disponible en la búsqueda. Muestra profesional, servicio,
 * fecha/hora/sede, estado, nivel de cobertura y el monto a abonar según el plan.
 * El horario usa la firma "Arco del día".
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
        <HoraArco fecha={turno.fechaHora} conFecha />
        <span>
          <MapPin className="ico" size={15} aria-hidden="true" />
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
