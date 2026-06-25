"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/context/SessionContext";
import { useToast } from "@/context/ToastContext";
import {
  getHistorialPaciente,
  cancelarTurno,
  proponerReprogramacion,
  confirmarReprogramacion,
  mensajeDeError,
} from "@/lib/api";
import { EmptyState, Spinner } from "@/components/Estados";
import { Modal } from "@/components/Modal";
import {
  formatearFechaHora,
  formatearMoneda,
  claseEstado,
} from "@/lib/format";

const CANCELABLES = ["RESERVADO", "CONFIRMADO"];

export default function MisTurnosPage() {
  const { usuario, listo, esPaciente } = useSession();
  const { exito, error } = useToast();

  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [dialogo, setDialogo] = useState(null); // { tipo: 'cancelar'|'reprogramar', turno }
  const [valor, setValor] = useState("");
  const [enviando, setEnviando] = useState(false);

  const cargar = useCallback(async () => {
    if (!usuario || !esPaciente) return;
    setCargando(true);
    try {
      const data = await getHistorialPaciente(usuario.id);
      setTurnos(data);
    } catch (e) {
      error(mensajeDeError(e, "No se pudo cargar el historial"));
    } finally {
      setCargando(false);
    }
  }, [usuario, esPaciente, error]);

  useEffect(() => {
    if (listo) cargar();
  }, [listo, cargar]);

  function abrir(tipo, turno) {
    setValor("");
    setDialogo({ tipo, turno });
  }

  async function confirmarDialogo() {
    const { tipo, turno } = dialogo;
    setEnviando(true);
    try {
      if (tipo === "cancelar") {
        if (!valor.trim()) {
          error("Indicá un motivo para cancelar.");
          setEnviando(false);
          return;
        }
        await cancelarTurno(turno._id, usuario.usuarioId, valor);
        exito("Turno cancelado.");
      } else if (tipo === "reprogramar") {
        if (!valor) {
          error("Elegí una nueva fecha y hora.");
          setEnviando(false);
          return;
        }
        await proponerReprogramacion(turno._id, usuario.usuarioId, new Date(valor).toISOString());
        exito("Solicitud de cambio de fecha enviada. Queda pendiente de confirmación.");
      }
      setDialogo(null);
      cargar();
    } catch (e) {
      error(mensajeDeError(e, "No se pudo completar la acción"));
    } finally {
      setEnviando(false);
    }
  }

  async function confirmarCambio(turno) {
    try {
      await confirmarReprogramacion(turno._id, usuario.usuarioId);
      exito("Nueva fecha confirmada.");
      cargar();
    } catch (e) {
      error(mensajeDeError(e, "No se pudo confirmar la reprogramación"));
    }
  }

  if (!listo) return <div className="container page" />;

  if (!usuario || !esPaciente) {
    return (
      <div className="container page">
        <EmptyState emoji="👤" titulo="Ingresá como paciente">
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
        <h1>Mis turnos</h1>
        <p>Historial de turnos de {usuario.nombre}.</p>
      </div>

      {cargando ? (
        <div className="row" style={{ padding: 24 }}>
          <Spinner ink /> <span className="muted">Cargando…</span>
        </div>
      ) : turnos.length === 0 ? (
        <EmptyState
          emoji="📅"
          titulo="Todavía no tenés turnos"
          detalle="Cuando reserves un turno lo vas a ver acá."
        >
          <Link href="/buscar" className="btn btn--primary">
            Buscar turnos
          </Link>
        </EmptyState>
      ) : (
        <div className="stack">
          {turnos.map((t) => (
            <div className="card" key={t._id}>
              <div className="row row--between" style={{ alignItems: "flex-start" }}>
                <div>
                  <div className="turno-card__medico">
                    {t.servicio?.nombre}{" "}
                    <span className="muted" style={{ fontWeight: 400 }}>
                      · {t.servicioTipo}
                    </span>
                  </div>
                  <div className="turno-card__sub">
                    {t.medico?.nombre} · {t.sede?.nombre || "Sede a confirmar"}
                  </div>
                  <div className="mt-8">{formatearFechaHora(t.fechaHora)}</div>
                  {t.fechaPropuesta && (
                    <div className="muted mt-8" style={{ fontSize: "0.88rem" }}>
                      Nueva fecha propuesta: {formatearFechaHora(t.fechaPropuesta)}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span className={claseEstado(t.estado)}>{t.estado}</span>
                  <div className="mt-8 precio-final" style={{ fontSize: "1.05rem" }}>
                    {formatearMoneda(t.costoConCobertura ?? t.costo)}
                  </div>
                </div>
              </div>

              <div className="row mt-16">
                {CANCELABLES.includes(t.estado) && (
                  <>
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={() => abrir("reprogramar", t)}
                    >
                      Solicitar cambio de fecha
                    </button>
                    <button
                      className="btn btn--danger btn--sm"
                      onClick={() => abrir("cancelar", t)}
                    >
                      Cancelar turno
                    </button>
                  </>
                )}
                {t.estado === "PENDIENTE_CONFIRMACION" && t.solicitadoPor !== usuario.usuarioId && (
                  <button
                    className="btn btn--primary btn--sm"
                    onClick={() => confirmarCambio(t)}
                  >
                    Confirmar nueva fecha
                  </button>
                )}
                {t.estado === "PENDIENTE_CONFIRMACION" && t.solicitadoPor === usuario.usuarioId && (
                  <span className="muted" style={{ fontSize: "0.85rem" }}>
                    Esperando confirmación del médico
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {dialogo && (
        <Modal
          titulo={dialogo.tipo === "cancelar" ? "Cancelar turno" : "Solicitar cambio de fecha"}
          onClose={() => setDialogo(null)}
        >
          {dialogo.tipo === "cancelar" ? (
            <div className="field">
              <label htmlFor="motivo">Motivo de la cancelación</label>
              <textarea
                id="motivo"
                className="input"
                rows={3}
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Ej.: surgió un imprevisto"
              />
              <p className="muted" style={{ fontSize: "0.82rem" }}>
                Recordá que se debe cancelar con al menos 1 hora de anticipación.
              </p>
            </div>
          ) : (
            <div className="field">
              <label htmlFor="nuevaFecha">Nueva fecha y hora</label>
              <input
                id="nuevaFecha"
                type="datetime-local"
                className="input"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
            </div>
          )}
          <div className="row row--between mt-16">
            <button className="btn btn--ghost" onClick={() => setDialogo(null)}>
              Volver
            </button>
            <button className="btn btn--primary" onClick={confirmarDialogo} disabled={enviando}>
              {enviando ? "Enviando…" : "Confirmar"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
