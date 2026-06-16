"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/context/SessionContext";
import { useToast } from "@/context/ToastContext";
import {
  getNotificacionesNoLeidas,
  getNotificacionesLeidas,
  marcarNotificacionLeida,
  mensajeDeError,
} from "@/lib/api";
import { EmptyState, Spinner } from "@/components/Estados";

export default function NotificacionesPage() {
  const { usuario, listo } = useSession();
  const { error } = useToast();

  const [tab, setTab] = useState("no-leidas");
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    if (!usuario) return;
    setCargando(true);
    try {
      const data =
        tab === "no-leidas"
          ? await getNotificacionesNoLeidas(usuario.usuarioId)
          : await getNotificacionesLeidas(usuario.usuarioId);
      setItems(data);
    } catch (e) {
      error(mensajeDeError(e, "No se pudieron cargar las notificaciones"));
    } finally {
      setCargando(false);
    }
  }, [usuario, tab, error]);

  useEffect(() => {
    if (listo) cargar();
  }, [listo, cargar]);

  async function marcar(id) {
    try {
      await marcarNotificacionLeida(id);
      setItems((prev) => prev.filter((n) => n._id !== id));
    } catch (e) {
      error(mensajeDeError(e, "No se pudo marcar como leída"));
    }
  }

  if (!listo) return <div className="container page" />;

  if (!usuario) {
    return (
      <div className="container page">
        <EmptyState emoji="👤" titulo="Ingresá para ver tus notificaciones">
          <Link href="/" className="btn btn--primary">
            Elegir usuario
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="page__head">
        <h1>Notificaciones</h1>
        <p>Eventos relevantes de tus turnos.</p>
      </div>

      <div className="row" role="tablist" aria-label="Filtro de notificaciones">
        <button
          role="tab"
          aria-selected={tab === "no-leidas"}
          className={`btn btn--sm ${tab === "no-leidas" ? "btn--primary" : "btn--ghost"}`}
          onClick={() => setTab("no-leidas")}
        >
          Sin leer
        </button>
        <button
          role="tab"
          aria-selected={tab === "leidas"}
          className={`btn btn--sm ${tab === "leidas" ? "btn--primary" : "btn--ghost"}`}
          onClick={() => setTab("leidas")}
        >
          Leídas
        </button>
      </div>

      <div className="mt-16">
        {cargando ? (
          <div className="row" style={{ padding: 24 }}>
            <Spinner ink /> <span className="muted">Cargando…</span>
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            emoji="🔔"
            titulo={tab === "no-leidas" ? "No tenés notificaciones sin leer" : "No hay notificaciones leídas"}
          />
        ) : (
          <div className="stack">
            {items.map((n) => (
              <div className="card row row--between" key={n._id} style={{ alignItems: "center" }}>
                <div>
                  <div>{n.mensaje}</div>
                  <div className="muted" style={{ fontSize: "0.8rem" }}>
                    {new Date(n.fechaHoraCreacion || n.createdAt).toLocaleString("es-AR")}
                  </div>
                </div>
                {tab === "no-leidas" && (
                  <button className="btn btn--ghost btn--sm" onClick={() => marcar(n._id)}>
                    Marcar como leída
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
