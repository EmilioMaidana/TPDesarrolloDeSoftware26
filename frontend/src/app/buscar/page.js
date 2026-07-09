"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import { useSession } from "@/context/SessionContext";
import { useCarrito } from "@/context/CarritoContext";
import { useToast } from "@/context/ToastContext";
import {
  buscarTurnos,
  getMedicos,
  getEspecialidades,
  getPracticas,
  getSedes,
  reservarTurno,
  mensajeDeError,
} from "@/lib/api";
import { TurnoRow } from "@/components/TurnoRow";
import { SkeletonRows, EmptyState } from "@/components/Estados";

const LIMIT = 8;
const FILTROS_INICIALES = {
  medicoId: "",
  especialidadId: "",
  practicaId: "",
  sede: "",
  fechaInicio: "",
  fechaFin: "",
};

export default function BuscarPage() {
  const { usuario, listo, esPaciente } = useSession();
  const { agregar, quitar, contiene } = useCarrito();
  const { exito, error } = useToast();

  const [form, setForm] = useState(FILTROS_INICIALES);
  const [aplicados, setAplicados] = useState(FILTROS_INICIALES);
  const [sortBy, setSortBy] = useState("fechaHora");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);

  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [practicas, setPracticas] = useState([]);
  const [sedes, setSedes] = useState([]);

  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [reservandoId, setReservandoId] = useState(null);
  const [sheetAbierto, setSheetAbierto] = useState(false);
  const [conteo, setConteo] = useState(null);

  // Carga de catálogos para los filtros.
  useEffect(() => {
    (async () => {
      try {
        const [med, esp, pra, sed] = await Promise.all([
          getMedicos(),
          getEspecialidades(),
          getPracticas(),
          getSedes(),
        ]);
        setMedicos(med);
        setEspecialidades(esp);
        setPracticas(pra);
        setSedes(sed);
      } catch (e) {
        error(mensajeDeError(e, "No se pudieron cargar los filtros"));
      }
    })();
  }, [error]);

  const buscar = useCallback(async () => {
    if (!usuario || !esPaciente) return;
    setCargando(true);
    try {
      const data = await buscarTurnos(usuario.id, {
        ...aplicados,
        page,
        limit: LIMIT,
        sortBy,
        order,
      });
      setResultado(data);
    } catch (e) {
      error(mensajeDeError(e, "No se pudo realizar la búsqueda"));
      setResultado({ turnos: [], paginacion: { page: 1, totalPages: 0, total: 0 } });
    } finally {
      setCargando(false);
    }
  }, [usuario, esPaciente, aplicados, page, sortBy, order, error]);

  useEffect(() => {
    buscar();
  }, [buscar]);

  // Conteo en vivo del botón "Aplicar filtros (N)": consulta el total con los
  // filtros del formulario (aún no aplicados), con debounce y limit=1.
  useEffect(() => {
    if (!usuario || !esPaciente) return;
    let cancelado = false;
    const t = setTimeout(async () => {
      try {
        const data = await buscarTurnos(usuario.id, { ...form, page: 1, limit: 1 });
        if (!cancelado) setConteo(data.paginacion.total);
      } catch {
        if (!cancelado) setConteo(null);
      }
    }, 350);
    return () => {
      cancelado = true;
      clearTimeout(t);
    };
  }, [form, usuario, esPaciente]);

  function aplicar() {
    setPage(1);
    setAplicados(form);
    setSheetAbierto(false);
  }

  function cambiarOrden(campo) {
    if (sortBy === campo) {
      setOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(campo);
      setOrder("asc");
    }
    setPage(1);
  }

  function limpiar() {
    setForm(FILTROS_INICIALES);
    setAplicados(FILTROS_INICIALES);
    setPage(1);
  }

  function quitarFiltro(key) {
    const nuevo = { ...aplicados, [key]: "" };
    setForm(nuevo);
    setAplicados(nuevo);
    setPage(1);
  }

  async function onReservar(turno) {
    setReservandoId(turno._id);
    try {
      await reservarTurno(turno._id, usuario.id);
      exito("¡Turno reservado! Te avisamos cuando el médico lo confirme.");
      quitar(turno._id);
      buscar();
    } catch (e) {
      error(mensajeDeError(e, "No se pudo reservar el turno"));
    } finally {
      setReservandoId(null);
    }
  }

  if (!listo) {
    return (
      <div className="container page">
        <SkeletonRows cantidad={4} />
      </div>
    );
  }

  if (!usuario || !esPaciente) {
    return (
      <div className="container page">
        <EmptyState
          emoji="👤"
          titulo="Ingresá como paciente"
          detalle="Para buscar turnos según tu cobertura primero elegí tu perfil de paciente."
        >
          <Link href="/login" className="btn btn--primary">
            Iniciar sesión
          </Link>
        </EmptyState>
      </div>
    );
  }

  const turnos = resultado?.turnos ?? [];
  const paginacion = resultado?.paginacion ?? { page: 1, totalPages: 0, total: 0 };
  const cantActivos = Object.values(aplicados).filter(Boolean).length;

  const nombreDe = (lista, id, campo = "nombre") =>
    lista.find((x) => x._id === id)?.[campo] || id;

  const chips = [];
  if (aplicados.medicoId)
    chips.push({ key: "medicoId", label: "Profesional", valor: nombreDe(medicos, aplicados.medicoId) });
  if (aplicados.especialidadId)
    chips.push({ key: "especialidadId", label: "Especialidad", valor: nombreDe(especialidades, aplicados.especialidadId) });
  if (aplicados.practicaId)
    chips.push({ key: "practicaId", label: "Práctica", valor: nombreDe(practicas, aplicados.practicaId) });
  if (aplicados.sede) chips.push({ key: "sede", label: "Sede", valor: aplicados.sede });
  if (aplicados.fechaInicio) chips.push({ key: "fechaInicio", label: "Desde", valor: aplicados.fechaInicio });
  if (aplicados.fechaFin) chips.push({ key: "fechaFin", label: "Hasta", valor: aplicados.fechaFin });

  const filtrosProps = { form, setForm, medicos, especialidades, practicas, sedes };

  return (
    <div className="container page">
      <div className="page__head">
        <h1>Buscar turnos</h1>
        <p>
          Resultados calculados según el plan de <strong>{usuario.nombre}</strong>.
        </p>
      </div>

      <div className="buscar-layout">
        {/* Panel de filtros — columna izquierda sticky en desktop */}
        <aside className="filtros-panel filtros-panel--desktop" aria-label="Filtros de búsqueda">
          <div className="filtros-panel__scroll">
            <FiltrosContenido scope="d" {...filtrosProps} />
          </div>
          <FiltrosFooter onLimpiar={limpiar} onAplicar={aplicar} conteo={conteo} />
        </aside>

        {/* Resultados */}
        <section className="resultados">
          <div className="resultados__toolbar">
            <button
              type="button"
              className="btn btn--ghost filtros-toggle"
              onClick={() => setSheetAbierto(true)}
            >
              <SlidersHorizontal size={16} />
              Filtros
              {cantActivos > 0 && <span className="nav-count">{cantActivos}</span>}
            </button>

            <div className="orden" role="group" aria-label="Ordenar resultados">
              <span className="orden__label">Ordená</span>
              <SortChip activo={sortBy === "fechaHora"} order={order} onClick={() => cambiarOrden("fechaHora")}>
                Fecha
              </SortChip>
              <SortChip activo={sortBy === "costo"} order={order} onClick={() => cambiarOrden("costo")}>
                Costo
              </SortChip>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="chips-activos" aria-label="Filtros aplicados">
              {chips.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  className="chip-activo"
                  onClick={() => quitarFiltro(c.key)}
                  title={`Quitar ${c.label}`}
                >
                  {c.label}: <b>{c.valor}</b>
                  <X size={13} aria-hidden="true" />
                </button>
              ))}
              <button type="button" className="chip-activo chip-activo--clear" onClick={limpiar}>
                Limpiar todo
              </button>
            </div>
          )}

          <div className="resultados__count" aria-live="polite">
            {cargando ? "Buscando…" : `${paginacion.total} turno(s)`}
          </div>

          {cargando ? (
            <SkeletonRows cantidad={5} />
          ) : turnos.length === 0 ? (
            <EmptyState
              emoji="🗓️"
              titulo="No hay turnos con estos filtros"
              detalle="Probá ampliar el rango de fechas o quitar alguno de los filtros aplicados."
            >
              {cantActivos > 0 && (
                <button className="btn btn--primary" onClick={limpiar}>
                  Limpiar filtros
                </button>
              )}
            </EmptyState>
          ) : (
            <>
              <div className="turno-list">
                {turnos.map((turno) => {
                  const enCarrito = contiene(turno._id);
                  return (
                    <TurnoRow
                      key={turno._id}
                      turno={turno}
                      acciones={
                        <>
                          <button
                            className={`btn btn--sm ${enCarrito ? "btn--ghost" : ""}`}
                            onClick={() => (enCarrito ? quitar(turno._id) : agregar(turno))}
                            aria-pressed={enCarrito}
                          >
                            {enCarrito ? "✓ En preselección" : "+ Preseleccionar"}
                          </button>
                          <button
                            className="btn btn--primary btn--sm"
                            onClick={() => onReservar(turno)}
                            disabled={reservandoId === turno._id}
                          >
                            {reservandoId === turno._id ? "Reservando…" : "Reservar"}
                          </button>
                        </>
                      }
                    />
                  );
                })}
              </div>

              {paginacion.totalPages > 1 && (
                <div className="pager">
                  <button
                    className="btn btn--ghost btn--sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    ← Anterior
                  </button>
                  <span className="pager__info">
                    Página {paginacion.page} de {paginacion.totalPages}
                  </span>
                  <button
                    className="btn btn--ghost btn--sm"
                    disabled={page >= paginacion.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* Hoja inferior de filtros — mobile */}
      {sheetAbierto && (
        <FiltrosSheet
          onClose={() => setSheetAbierto(false)}
          onLimpiar={limpiar}
          onAplicar={aplicar}
          conteo={conteo}
        >
          <FiltrosContenido scope="m" {...filtrosProps} />
        </FiltrosSheet>
      )}
    </div>
  );
}

/* ---------- Contenido de filtros (compartido desktop / sheet) ---------- */
function FiltrosContenido({ scope, form, setForm, medicos, especialidades, practicas, sedes }) {
  return (
    <div className="stack" style={{ gap: 18 }}>
      <div className="field">
        <label htmlFor={`${scope}-prof`}>Profesional</label>
        <select
          id={`${scope}-prof`}
          className="select"
          value={form.medicoId}
          onChange={(e) => setForm({ ...form, medicoId: e.target.value })}
        >
          <option value="">Todos</option>
          {medicos.map((m) => (
            <option key={m._id} value={m._id}>
              {m.nombre}
            </option>
          ))}
        </select>
      </div>

      <ChipGroup
        label="Especialidad"
        value={form.especialidadId}
        opciones={especialidades.map((e) => ({ value: e._id, label: e.nombre }))}
        onSelect={(v) => setForm({ ...form, especialidadId: v, practicaId: "" })}
      />
      <ChipGroup
        label="Práctica"
        value={form.practicaId}
        opciones={practicas.map((p) => ({ value: p._id, label: p.nombre }))}
        onSelect={(v) => setForm({ ...form, practicaId: v, especialidadId: "" })}
      />
      <ChipGroup
        label="Sede"
        value={form.sede}
        opciones={sedes.map((s) => ({ value: s.nombre, label: s.nombre }))}
        onSelect={(v) => setForm({ ...form, sede: v })}
      />

      <div className="filtro-grupo">
        <span className="filtro-grupo__label">Rango de fechas</span>
        <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor={`${scope}-desde`}>Desde</label>
            <input
              id={`${scope}-desde`}
              type="date"
              className="input"
              value={form.fechaInicio}
              onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
            />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor={`${scope}-hasta`}>Hasta</label>
            <input
              id={`${scope}-hasta`}
              type="date"
              className="input"
              value={form.fechaFin}
              onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChipGroup({ label, value, opciones, onSelect }) {
  return (
    <div className="filtro-grupo" role="group" aria-label={label}>
      <span className="filtro-grupo__label">{label}</span>
      <div className="filtro-chips">
        {opciones.map((o) => {
          const activo = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              className={`filtro-chip ${activo ? "filtro-chip--activo" : ""}`}
              aria-pressed={activo}
              onClick={() => onSelect(activo ? "" : o.value)}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FiltrosFooter({ onLimpiar, onAplicar, conteo }) {
  return (
    <div className="filtros-footer">
      <button type="button" className="btn btn--ghost" onClick={onLimpiar}>
        Limpiar
      </button>
      <button type="button" className="btn btn--primary" onClick={onAplicar}>
        Aplicar filtros{conteo != null ? ` (${conteo})` : ""}
      </button>
    </div>
  );
}

function FiltrosSheet({ onClose, onLimpiar, onAplicar, conteo, children }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Filtros"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet__head">
          <h3 style={{ margin: 0 }}>Filtros</h3>
          <button className="toast__close" aria-label="Cerrar" onClick={onClose} style={{ fontSize: 20 }}>
            <X size={20} />
          </button>
        </div>
        <div className="sheet__body">{children}</div>
        <FiltrosFooter onLimpiar={onLimpiar} onAplicar={onAplicar} conteo={conteo} />
      </div>
    </div>
  );
}

/* Chip de ordenamiento con flecha (asc/desc). */
function SortChip({ activo, order, onClick, children }) {
  const sentido = activo ? (order === "asc" ? "ascendente" : "descendente") : "";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`sort-chip ${activo ? "sort-chip--activo" : ""}`}
      aria-pressed={activo}
      title={`Ordenar por ${children}${sentido ? ` (${sentido})` : ""}`}
    >
      <span>{children}</span>
      <svg
        className={`sort-chip__ico ${activo && order === "desc" ? "sort-chip__ico--desc" : ""}`}
        width="14"
        height="14"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M12 5v14M12 5l-5 5M12 5l5 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
