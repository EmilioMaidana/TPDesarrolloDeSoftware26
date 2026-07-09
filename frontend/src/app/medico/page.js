"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/context/SessionContext";
import { useToast } from "@/context/ToastContext";
import {
  getMedico,
  getEspecialidades,
  getPracticas,
  getAgendaMedico,
  aceptarTurno,
  marcarRealizado,
  cancelarTurno,
  proponerReprogramacion,
  confirmarReprogramacion,
  altaServicio,
  bajaServicio,
  crearDisponibilidad,
  mensajeDeError,
} from "@/lib/api";
import { EmptyState, Spinner } from "@/components/Estados";
import { Modal } from "@/components/Modal";
import { HoraArco } from "@/components/ArcoDelDia";
import { formatearFechaHora, claseEstado } from "@/lib/format";

const DIAS = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];

export default function MedicoPage() {
  const { usuario, listo, esMedico } = useSession();
  const { exito, error } = useToast();

  const [tab, setTab] = useState("agenda");
  const [medico, setMedico] = useState(null);
  const [catEsp, setCatEsp] = useState([]);
  const [catPra, setCatPra] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarMedico = useCallback(async () => {
    if (!usuario || !esMedico) return;
    try {
      const [m, esp, pra] = await Promise.all([
        getMedico(usuario.id),
        getEspecialidades(),
        getPracticas(),
      ]);
      setMedico(m);
      setCatEsp(esp);
      setCatPra(pra);
    } catch (e) {
      error(mensajeDeError(e, "No se pudieron cargar los datos del médico"));
    } finally {
      setCargando(false);
    }
  }, [usuario, esMedico, error]);

  useEffect(() => {
    if (listo) cargarMedico();
  }, [listo, cargarMedico]);

  if (!listo) return <div className="container page" />;

  if (!usuario || !esMedico) {
    return (
      <div className="container page">
        <EmptyState emoji="🩺" titulo="Ingresá como médico" detalle="Este panel es para profesionales.">
          <Link href="/login" className="btn btn--primary">
            Iniciar sesión
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="page__head">
        <h1>Panel del profesional</h1>
        <p>{usuario.nombre}</p>
      </div>

      <div className="row" role="tablist" aria-label="Secciones del panel">
        {[
          ["agenda", "Agenda"],
          ["servicios", "Servicios"],
          ["disponibilidad", "Disponibilidad"],
        ].map(([k, label]) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            className={`btn btn--sm ${tab === k ? "btn--primary" : "btn--ghost"}`}
            onClick={() => setTab(k)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-16">
        {cargando ? (
          <div className="row" style={{ padding: 24 }}>
            <Spinner ink /> <span className="muted">Cargando…</span>
          </div>
        ) : tab === "agenda" ? (
          <Agenda medicoId={usuario.id} usuarioId={usuario.usuarioId} exito={exito} error={error} />
        ) : tab === "servicios" ? (
          <Servicios
            medico={medico}
            catEsp={catEsp}
            catPra={catPra}
            recargar={cargarMedico}
            exito={exito}
            error={error}
          />
        ) : (
          <Disponibilidad
            medico={medico}
            recargar={cargarMedico}
            exito={exito}
            error={error}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------- Agenda ---------------- */
function Agenda({ medicoId, usuarioId, exito, error }) {
  const [estado, setEstado] = useState("");
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [dialogo, setDialogo] = useState(null); // { tipo: 'cancelar'|'reprogramar', turno }
  const [motivo, setMotivo] = useState("");
  const [nuevaFecha, setNuevaFecha] = useState("");

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const data = await getAgendaMedico(medicoId, estado || undefined);
      setTurnos(data);
    } catch (e) {
      error(mensajeDeError(e, "No se pudo cargar la agenda"));
    } finally {
      setCargando(false);
    }
  }, [medicoId, estado, error]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function aceptar(t) {
    try {
      await aceptarTurno(t._id, medicoId);
      exito("Turno confirmado. Se notificó al paciente.");
      cargar();
    } catch (e) {
      error(mensajeDeError(e, "No se pudo aceptar el turno"));
    }
  }

  async function realizar(t) {
    try {
      await marcarRealizado(t._id, medicoId);
      exito("Turno marcado como realizado.");
      cargar();
    } catch (e) {
      error(mensajeDeError(e, "No se pudo marcar el turno"));
    }
  }

  async function cancelar() {
    if (!motivo.trim()) {
      error("Indicá un motivo.");
      return;
    }
    try {
      await cancelarTurno(dialogo.turno._id, usuarioId, motivo);
      exito("Turno cancelado. Se notificó al paciente.");
      setDialogo(null);
      setMotivo("");
      cargar();
    } catch (e) {
      error(mensajeDeError(e, "No se pudo cancelar el turno"));
    }
  }

  async function reprogramar() {
    if (!nuevaFecha) {
      error("Elegí una nueva fecha y hora.");
      return;
    }
    try {
      await proponerReprogramacion(dialogo.turno._id, usuarioId, new Date(nuevaFecha).toISOString());
      exito("Solicitud de cambio de fecha enviada. Queda pendiente de confirmación del paciente.");
      setDialogo(null);
      setNuevaFecha("");
      cargar();
    } catch (e) {
      error(mensajeDeError(e, "No se pudo enviar la propuesta de reprogramación"));
    }
  }

  async function confirmarCambio(t) {
    try {
      await confirmarReprogramacion(t._id, usuarioId);
      exito("Nueva fecha confirmada.");
      cargar();
    } catch (e) {
      error(mensajeDeError(e, "No se pudo confirmar la reprogramación"));
    }
  }

  return (
    <div className="stack">
      <div className="field" style={{ maxWidth: 260 }}>
        <label htmlFor="estado">Filtrar por estado</label>
        <select
          id="estado"
          className="select"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="DISPONIBLE">Disponibles</option>
          <option value="RESERVADO">Reservados</option>
          <option value="CONFIRMADO">Confirmados</option>
          <option value="PENDIENTE_CONFIRMACION">Pendientes de confirmación</option>
          <option value="REALIZADO">Realizados</option>
          <option value="CANCELADO">Cancelados</option>
        </select>
      </div>

      {cargando ? (
        <div className="row" style={{ padding: 24 }}>
          <Spinner ink /> <span className="muted">Cargando…</span>
        </div>
      ) : turnos.length === 0 ? (
        <EmptyState emoji="📋" titulo="No hay turnos para este filtro" />
      ) : (
        <div className="table-wrap card" style={{ padding: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Fecha y hora</th>
                <th>Servicio</th>
                <th>Paciente</th>
                <th>Estado</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {turnos.map((t) => (
                <tr key={t._id}>
                  <td>
                    <HoraArco fecha={t.fechaHora} conFecha />
                    {t.fechaPropuesta && (
                      <div className="muted" style={{ fontSize: "0.78rem" }}>
                        Nueva fecha propuesta:{" "}
                        <span className="data">{formatearFechaHora(t.fechaPropuesta)}</span>
                      </div>
                    )}
                  </td>
                  <td>
                    {t.servicio?.nombre}
                    <div className="muted" style={{ fontSize: "0.78rem" }}>{t.servicioTipo}</div>
                  </td>
                  <td>{t.paciente?.nombre || "—"}</td>
                  <td>
                    <span className={claseEstado(t.estado)}>{t.estado}</span>
                  </td>
                  <td className="text-right">
                    <div className="row" style={{ justifyContent: "flex-end", flexWrap: "wrap", gap: 4 }}>
                      {t.estado === "RESERVADO" && (
                        <button className="btn btn--primary btn--sm" onClick={() => aceptar(t)}>
                          Aceptar
                        </button>
                      )}
                      {["RESERVADO", "CONFIRMADO"].includes(t.estado) && (
                        <>
                          <button className="btn btn--ghost btn--sm" onClick={() => realizar(t)}>
                            Realizado
                          </button>
                          <button
                            className="btn btn--ghost btn--sm"
                            onClick={() => {
                              setNuevaFecha("");
                              setDialogo({ tipo: "reprogramar", turno: t });
                            }}
                          >
                            Cambiar fecha
                          </button>
                          <button
                            className="btn btn--danger btn--sm"
                            onClick={() => {
                              setMotivo("");
                              setDialogo({ tipo: "cancelar", turno: t });
                            }}
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                      {t.estado === "PENDIENTE_CONFIRMACION" && t.solicitadoPor !== usuarioId && (
                        <button
                          className="btn btn--primary btn--sm"
                          onClick={() => confirmarCambio(t)}
                        >
                          Confirmar nueva fecha
                        </button>
                      )}
                      {t.estado === "PENDIENTE_CONFIRMACION" && t.solicitadoPor === usuarioId && (
                        <span className="muted" style={{ fontSize: "0.85rem" }}>
                          Esperando confirmación del paciente
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {dialogo && (
        <Modal
          titulo={dialogo.tipo === "cancelar" ? "Cancelar turno" : "Solicitar cambio de fecha"}
          onClose={() => setDialogo(null)}
        >
          {dialogo.tipo === "cancelar" ? (
            <div className="field">
              <label htmlFor="motivoMed">Motivo</label>
              <textarea
                id="motivoMed"
                className="input"
                rows={3}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />
              <p className="muted" style={{ fontSize: "0.82rem" }}>
                Debe cancelarse con al menos 1 hora de anticipación.
              </p>
            </div>
          ) : (
            <div className="field">
              <label htmlFor="nuevaFechaMed">Nueva fecha y hora</label>
              <input
                id="nuevaFechaMed"
                type="datetime-local"
                className="input"
                value={nuevaFecha}
                onChange={(e) => setNuevaFecha(e.target.value)}
              />
            </div>
          )}
          <div className="row row--between mt-16">
            <button className="btn btn--ghost" onClick={() => setDialogo(null)}>
              Volver
            </button>
            <button
              className={`btn ${dialogo.tipo === "cancelar" ? "btn--danger" : "btn--primary"}`}
              onClick={dialogo.tipo === "cancelar" ? cancelar : reprogramar}
            >
              {dialogo.tipo === "cancelar" ? "Cancelar turno" : "Enviar propuesta"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------------- Servicios ---------------- */
function Servicios({ medico, catEsp, catPra, recargar, exito, error }) {
  const [tipo, setTipo] = useState("Especialidad");
  const [servicioId, setServicioId] = useState("");

  const catalogo = tipo === "Especialidad" ? catEsp : catPra;
  const propios = tipo === "Especialidad" ? medico.especialidades : medico.practicas;
  const propiosIds = new Set((propios || []).map((s) => s._id));
  const disponiblesParaAlta = catalogo.filter((s) => !propiosIds.has(s._id));

  async function alta() {
    if (!servicioId) {
      error("Elegí un servicio.");
      return;
    }
    try {
      await altaServicio(medico._id, tipo, servicioId);
      exito("Servicio agregado.");
      setServicioId("");
      recargar();
    } catch (e) {
      error(mensajeDeError(e, "No se pudo agregar el servicio"));
    }
  }

  async function baja(t, id) {
    try {
      await bajaServicio(medico._id, t, id);
      exito("Servicio dado de baja.");
      recargar();
    } catch (e) {
      error(mensajeDeError(e, "No se pudo quitar el servicio"));
    }
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", alignItems: "start" }}>
      <div className="panel">
        <h3>Mis servicios</h3>
        <ListaServicios titulo="Especialidades" items={medico.especialidades} tipo="Especialidad" onBaja={baja} />
        <ListaServicios titulo="Prácticas" items={medico.practicas} tipo="Practica" onBaja={baja} />
      </div>

      <div className="panel">
        <h3>Agregar servicio</h3>
        <div className="field mt-8">
          <label htmlFor="tipoServ">Tipo</label>
          <select
            id="tipoServ"
            className="select"
            value={tipo}
            onChange={(e) => {
              setTipo(e.target.value);
              setServicioId("");
            }}
          >
            <option value="Especialidad">Especialidad</option>
            <option value="Practica">Práctica</option>
          </select>
        </div>
        <div className="field mt-8">
          <label htmlFor="servSel">Servicio</label>
          <select
            id="servSel"
            className="select"
            value={servicioId}
            onChange={(e) => setServicioId(e.target.value)}
          >
            <option value="">Elegí…</option>
            {disponiblesParaAlta.map((s) => (
              <option key={s._id} value={s._id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn--primary btn--block mt-16" onClick={alta}>
          Agregar
        </button>
      </div>
    </div>
  );
}

function ListaServicios({ titulo, items, tipo, onBaja }) {
  return (
    <div className="mt-8">
      <strong className="muted" style={{ fontSize: "0.82rem" }}>
        {titulo}
      </strong>
      {(!items || items.length === 0) ? (
        <p className="muted" style={{ fontSize: "0.88rem" }}>Sin {titulo.toLowerCase()}.</p>
      ) : (
        <div className="stack mt-8">
          {items.map((s) => (
            <div className="row row--between" key={s._id}>
              <span>{s.nombre}</span>
              <button className="btn btn--danger btn--sm" onClick={() => onBaja(tipo, s._id)}>
                Quitar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Disponibilidad ---------------- */
function Disponibilidad({ medico, recargar, exito, error }) {
  const servicios = [
    ...(medico.especialidades || []).map((s) => ({ ...s, tipo: "Especialidad" })),
    ...(medico.practicas || []).map((s) => ({ ...s, tipo: "Practica" })),
  ];
  const [form, setForm] = useState({
    diaSemana: "LUNES",
    horaDesde: "09:00",
    horaHasta: "13:00",
    servicio: "",
    sedeIdx: medico.sedes?.length ? "0" : "",
  });
  const [enviando, setEnviando] = useState(false);

  const lookupServicio = new Map(servicios.map((s) => [s._id, s]));

  async function crear() {
    if (!form.servicio) {
      error("Elegí un servicio para la disponibilidad.");
      return;
    }
    const serv = lookupServicio.get(form.servicio);
    const sede = form.sedeIdx !== "" ? medico.sedes[Number(form.sedeIdx)] : undefined;
    setEnviando(true);
    try {
      const res = await crearDisponibilidad(medico._id, {
        diaSemana: form.diaSemana,
        horaDesde: form.horaDesde,
        horaHasta: form.horaHasta,
        servicio: form.servicio,
        servicioTipo: serv.tipo,
        sede: sede ? { nombre: sede.nombre, direccion: sede.direccion } : undefined,
      });
      exito(`Disponibilidad creada. Se generaron ${res.turnosGenerados} turnos.`);
      recargar();
    } catch (e) {
      error(mensajeDeError(e, "No se pudo crear la disponibilidad"));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", alignItems: "start" }}>
      <div className="panel">
        <h3>Disponibilidad actual</h3>
        {(!medico.disponibilidades || medico.disponibilidades.length === 0) ? (
          <p className="muted">Todavía no cargaste disponibilidad.</p>
        ) : (
          <div className="stack mt-8">
            {medico.disponibilidades.map((d, i) => (
              <div className="card" key={d._id || i} style={{ padding: 12 }}>
                <strong>{d.diaSemana}</strong> · {d.horaDesde}–{d.horaHasta}
                <div className="muted" style={{ fontSize: "0.85rem" }}>
                  {lookupServicio.get(d.servicio)?.nombre || d.servicioTipo}
                  {d.sede?.nombre ? ` · ${d.sede.nombre}` : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="panel">
        <h3>Definir disponibilidad</h3>
        <p className="muted" style={{ fontSize: "0.85rem" }}>
          Al guardar, el sistema genera automáticamente los turnos DISPONIBLES.
        </p>
        <div className="field mt-8">
          <label htmlFor="dia">Día</label>
          <select
            id="dia"
            className="select"
            value={form.diaSemana}
            onChange={(e) => setForm({ ...form, diaSemana: e.target.value })}
          >
            {DIAS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="row mt-8">
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="hd">Desde</label>
            <input
              id="hd"
              type="time"
              className="input"
              value={form.horaDesde}
              onChange={(e) => setForm({ ...form, horaDesde: e.target.value })}
            />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="hh">Hasta</label>
            <input
              id="hh"
              type="time"
              className="input"
              value={form.horaHasta}
              onChange={(e) => setForm({ ...form, horaHasta: e.target.value })}
            />
          </div>
        </div>
        <div className="field mt-8">
          <label htmlFor="serv">Servicio</label>
          <select
            id="serv"
            className="select"
            value={form.servicio}
            onChange={(e) => setForm({ ...form, servicio: e.target.value })}
          >
            <option value="">Elegí…</option>
            {servicios.map((s) => (
              <option key={s._id} value={s._id}>
                {s.nombre} ({s.tipo})
              </option>
            ))}
          </select>
        </div>
        {medico.sedes?.length > 0 && (
          <div className="field mt-8">
            <label htmlFor="sede">Sede</label>
            <select
              id="sede"
              className="select"
              value={form.sedeIdx}
              onChange={(e) => setForm({ ...form, sedeIdx: e.target.value })}
            >
              {medico.sedes.map((s, i) => (
                <option key={i} value={String(i)}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>
        )}
        <button className="btn btn--primary btn--block mt-16" onClick={crear} disabled={enviando}>
          {enviando ? "Generando turnos…" : "Guardar disponibilidad"}
        </button>
      </div>
    </div>
  );
}
