const fmtMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatearMoneda(valor) {
  if (valor === null || valor === undefined || Number.isNaN(Number(valor))) {
    return "-";
  }
  return fmtMoneda.format(Number(valor));
}

export function formatearFecha(fecha) {
  if (!fecha) return "-";
  return new Date(fecha).toLocaleDateString("es-AR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatearHora(fecha) {
  if (!fecha) return "-";
  // Sin timeZone fijo: se usa el huso horario local del navegador del usuario.
  // El backend guarda el instante en UTC; acá se adapta a la zona del cliente.
  return new Date(fecha).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatearFechaHora(fecha) {
  return `${formatearFecha(fecha)} · ${formatearHora(fecha)} hs`;
}

// Etiqueta y clase de color para el nivel de cobertura.
export function infoCobertura(nivel) {
  switch (nivel) {
    case "TOTAL":
      return { texto: "Cubierto", clase: "badge--ok" };
    case "PARCIAL":
      return { texto: "Cobertura parcial", clase: "badge--warn" };
    default:
      return { texto: "No cubierto", clase: "badge--off" };
  }
}

// Color del estado de un turno.
export function claseEstado(estado) {
  switch (estado) {
    case "DISPONIBLE":
      return "estado estado--disponible";
    case "RESERVADO":
      return "estado estado--reservado";
    case "CONFIRMADO":
      return "estado estado--confirmado";
    case "REALIZADO":
      return "estado estado--realizado";
    case "CANCELADO":
      return "estado estado--cancelado";
    default:
      return "estado";
  }
}
