"use client";

import { formatearHora, formatearFechaHora } from "@/lib/format";

// Elemento de firma del sistema: un pequeño "arco del día" con cuatro tramos
// (madrugada / mañana / tarde / noche). El tramo del turno queda encendido en el
// acento primario, o en el secundario (damasco) si el turno es HOY.

const TRAMOS = ["madrugada", "mañana", "tarde", "noche"];

// Centros de los 4 puntos sobre un arco superior (viewBox 24x14).
const PUNTOS = [
  [2.76, 8.17],
  [8.17, 2.76],
  [15.83, 2.76],
  [21.24, 8.17],
];

function tramoDeFecha(fecha) {
  const h = new Date(fecha).getHours(); // hora local del usuario
  if (h < 6) return 0;
  if (h < 12) return 1;
  if (h < 19) return 2;
  return 3;
}

function esHoy(fecha) {
  const d = new Date(fecha);
  const hoy = new Date();
  return (
    d.getFullYear() === hoy.getFullYear() &&
    d.getMonth() === hoy.getMonth() &&
    d.getDate() === hoy.getDate()
  );
}

export function ArcoDelDia({ fecha, size = 22 }) {
  const activo = tramoDeFecha(fecha);
  const color = esHoy(fecha) ? "var(--secondary)" : "var(--primary)";
  return (
    <svg
      className="arco"
      width={size}
      height={(size * 14) / 24}
      viewBox="0 0 24 14"
      aria-hidden="true"
    >
      <path
        d="M2 12 A 10 10 0 0 0 22 12"
        fill="none"
        stroke="var(--border-strong)"
        strokeWidth="1.1"
      />
      {PUNTOS.map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={i === activo ? 2.4 : 1.5}
          fill={i === activo ? color : "var(--text-3)"}
        />
      ))}
    </svg>
  );
}

// Combina el arco con el dato temporal en monoespaciada. Es la forma en que se
// muestra CUALQUIER horario de turno en toda la app.
export function HoraArco({ fecha, conFecha = false }) {
  const hoy = esHoy(fecha);
  const etiqueta = `Turno de ${TRAMOS[tramoDeFecha(fecha)]}${hoy ? " · hoy" : ""}`;
  return (
    <span className="hora-arco" title={etiqueta}>
      <ArcoDelDia fecha={fecha} />
      <span className="data">
        {conFecha ? formatearFechaHora(fecha) : `${formatearHora(fecha)} hs`}
      </span>
    </span>
  );
}
