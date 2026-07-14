"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/context/SessionContext";
import { useCarrito } from "@/context/CarritoContext";
import { useToast } from "@/context/ToastContext";
import { reservarTurno, mensajeDeError } from "@/lib/api";
import { TurnoCard } from "@/components/TurnoCard";
import { EmptyState } from "@/components/Estados";
import { formatearMoneda } from "@/lib/format";

export default function CarritoPage() {
  const { usuario, listo, esPaciente } = useSession();
  const { items, total, quitar, vaciar } = useCarrito();
  const { exito, error } = useToast();
  const [reservando, setReservando] = useState(false);

  if (!listo) return <div className="container page" />;

  if (!usuario || !esPaciente) {
    return (
      <div className="container page">
        <EmptyState
          emoji="👤"
          titulo="Ingresá como paciente"
          detalle="La preselección de turnos está disponible para pacientes."
        >
          <Link href="/login" className="btn btn--primary">
            Iniciar sesión
          </Link>
        </EmptyState>
      </div>
    );
  }

  async function reservarTodo() {
    setReservando(true);
    let ok = 0;
    const fallidos = [];
    const exitosos = [];

    // Reservamos uno por uno para poder informar cuáles fallaron.
    for (const turno of items) {
      try {
        await reservarTurno(turno._id, usuario.id);
        exitosos.push(turno._id);
        ok++;
      } catch (e) {
        fallidos.push(turno);
      }
    }

    if (fallidos.length === 0) {
      vaciar();
    } else {
      exitosos.forEach(id => quitar(id));
    }

    setReservando(false);
    if (ok > 0) exito(`Se reservaron ${ok} turno(s) de tu preselección.`);
    if (fallidos.length > 0)
      error(`${fallidos.length} turno(s) ya no estaban disponibles y se omitieron.`);
  }

  return (
    <div className="container page">
      <div className="page__head">
        <h1>Mi preselección</h1>
        <p>
          Revisá los turnos que preseleccionaste antes de confirmar la reserva.
          Esta lista se guarda solo en tu navegador.
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          emoji="🛒"
          titulo="Tu preselección está vacía"
          detalle="Agregá turnos desde la búsqueda para verlos acá."
        >
          <Link href="/buscar" className="btn btn--primary">
            Ir a buscar turnos
          </Link>
        </EmptyState>
      ) : (
        <div 
          className="grid" 
          style={{ 
            gridTemplateColumns: "2fr 1fr", 
            alignItems: "start", 
            gap: "3rem" 
          }}
        >
          <div className="grid grid--cards">
            {items.map((turno) => (
              <TurnoCard
                key={turno._id}
                turno={turno}
                acciones={
                  <button
                    className="btn btn--danger btn--sm btn--block"
                    onClick={() => quitar(turno._id)}
                  >
                    Quitar de la preselección
                  </button>
                }
              />
            ))}
          </div>

          <aside 
            aria-label="Resumen de la preselección"
            style={{
              position: "sticky",
              top: "2rem",
              padding: "2rem",
              borderRadius: "var(--radius, 20px)",
              background: "linear-gradient(145deg, var(--surface-2) 0%, var(--surface) 100%)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              backdropFilter: "blur(10px)"
            }}
          >
            <h3 style={{ 
              marginBottom: "1.5rem", 
              paddingBottom: "1rem",
              borderBottom: "1px solid var(--border)",
              color: "var(--text)",
              fontWeight: "700",
              fontSize: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              <span style={{ color: "var(--primary)" }}>📑</span> Resumen de Reserva
            </h3>
            
            <div className="row row--between" style={{ fontSize: "1rem", color: "var(--text-2)" }}>
              <span>Turnos preseleccionados</span>
              <strong style={{ color: "var(--text)" }}>{items.length}</strong>
            </div>
            
            <div 
              style={{ 
                marginTop: "1.5rem", 
                padding: "1.25rem", 
                borderRadius: "var(--radius-sm, 12px)", 
                backgroundColor: "var(--surface)",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                border: "1px solid var(--border-strong)"
              }}
            >
              <div className="row row--between" style={{ alignItems: "center" }}>
                <span style={{ color: "var(--text-2)", fontWeight: "500" }}>Total a abonar</span>
                <strong 
                  style={{ 
                    fontSize: "1.75rem", 
                    color: "var(--primary)",
                    fontWeight: "800",
                    lineHeight: "1"
                  }}
                >
                  {formatearMoneda(total)}
                </strong>
              </div>
            </div>

            <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "var(--primary-weak)", borderRadius: "var(--radius-sm, 8px)", borderLeft: "3px solid var(--primary)" }}>
              <p style={{ fontSize: "0.85rem", color: "var(--text-2)", margin: 0, lineHeight: "1.6" }}>
                El monto considera tu cobertura. Al reservar, cada turno queda
                pendiente de confirmación del profesional.
              </p>
            </div>

            <button
              onClick={reservarTodo}
              disabled={reservando}
              style={{ 
                marginTop: "2.5rem",
                padding: "1.1rem", 
                fontSize: "1.05rem", 
                fontWeight: "600",
                borderRadius: "var(--radius-sm, 12px)",
                backgroundColor: "var(--primary)",
                color: "var(--bg)",
                border: "none",
                cursor: reservando ? "not-allowed" : "pointer",
                boxShadow: "0 8px 20px rgba(63, 169, 166, 0.2)",
                transition: "all 0.2s ease",
                opacity: reservando ? 0.7 : 1
              }}
              onMouseOver={(e) => { if (!reservando) e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseOut={(e) => { if (!reservando) e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {reservando ? "Reservando…" : "Confirmar y Reservar"}
            </button>
            <button
              onClick={vaciar}
              disabled={reservando}
              style={{
                marginTop: "1rem",
                padding: "0.8rem",
                backgroundColor: "transparent",
                color: "var(--text-3)",
                border: "none",
                fontWeight: "500",
                cursor: reservando ? "not-allowed" : "pointer",
                transition: "color 0.2s ease"
              }}
              onMouseOver={(e) => { if (!reservando) e.currentTarget.style.color = "var(--danger)"; }}
              onMouseOut={(e) => { if (!reservando) e.currentTarget.style.color = "var(--text-3)"; }}
            >
              Vaciar preselección
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
