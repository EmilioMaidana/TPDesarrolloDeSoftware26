"use client";

// Skeleton de tarjetas: feedback de carga mientras llegan los datos del backend.
export function SkeletonCards({ cantidad = 6 }) {
  return (
    <div className="grid grid--cards" aria-hidden="true">
      {Array.from({ length: cantidad }).map((_, i) => (
        <div className="card turno-card" key={i}>
          <div className="skeleton" style={{ height: 20, width: "60%" }} />
          <div className="skeleton" style={{ height: 14, width: "40%" }} />
          <div className="skeleton" style={{ height: 14, width: "80%" }} />
          <div className="skeleton" style={{ height: 14, width: "70%" }} />
          <div className="skeleton" style={{ height: 38, width: "100%", marginTop: 8 }} />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ emoji = "🔍", titulo, detalle, children }) {
  return (
    <div className="empty">
      <div className="empty__emoji" aria-hidden="true">
        {emoji}
      </div>
      <h3>{titulo}</h3>
      {detalle && <p className="muted">{detalle}</p>}
      {children && <div className="mt-16">{children}</div>}
    </div>
  );
}

export function Spinner({ ink = false }) {
  return <span className={`spinner ${ink ? "spinner--ink" : ""}`} aria-hidden="true" />;
}
