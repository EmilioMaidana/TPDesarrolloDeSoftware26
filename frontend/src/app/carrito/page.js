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
          <Link href="/" className="btn btn--primary">
            Elegir usuario
          </Link>
        </EmptyState>
      </div>
    );
  }

  async function reservarTodo() {
    setReservando(true);
    let ok = 0;
    const fallidos = [];
    // Reservamos uno por uno para poder informar cuáles fallaron.
    for (const turno of items) {
      try {
        await reservarTurno(turno._id, usuario.id);
        quitar(turno._id);
        ok++;
      } catch (e) {
        fallidos.push(turno);
      }
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
        <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", alignItems: "start" }}>
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

          <aside className="panel" aria-label="Resumen de la preselección">
            <h3>Resumen</h3>
            <div className="row row--between mt-8">
              <span className="muted">Turnos</span>
              <strong>{items.length}</strong>
            </div>
            <div className="row row--between mt-8">
              <span className="muted">Total a abonar</span>
              <strong className="precio-final">{formatearMoneda(total)}</strong>
            </div>
            <p className="muted mt-8" style={{ fontSize: "0.82rem" }}>
              El monto considera tu cobertura. Al reservar, cada turno queda
              pendiente de confirmación del profesional.
            </p>
            <button
              className="btn btn--primary btn--block mt-16"
              onClick={reservarTodo}
              disabled={reservando}
            >
              {reservando ? "Reservando…" : "Reservar todos"}
            </button>
            <button
              className="btn btn--ghost btn--block mt-8"
              onClick={vaciar}
              disabled={reservando}
            >
              Vaciar preselección
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
