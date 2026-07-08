"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
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
import { TurnoCard } from "@/components/TurnoCard";
import { SkeletonCards, EmptyState } from "@/components/Estados";

const LIMIT = 9;
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

  function onSubmit(e) {
    e.preventDefault();
    setPage(1);
    setAplicados(form);
  }

  // Click en un criterio de orden: si ya está activo, invierte el sentido;
  // si no, lo activa en ascendente.
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
        <SkeletonCards cantidad={3} />
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

  return (
    <div className="container page">
      <div className="page__head">
        <h1>Buscar turnos</h1>
        <p>
          Resultados calculados según el plan de <strong>{usuario.nombre}</strong>.
        </p>
      </div>

      <form className="panel" onSubmit={onSubmit} aria-label="Filtros de búsqueda">
        <div className="filtros">
          <Select
            label="Profesional"
            value={form.medicoId}
            onChange={(v) => setForm({ ...form, medicoId: v })}
            opciones={medicos.map((m) => ({ value: m._id, label: m.nombre }))}
            placeholder="Todos"
          />
          <Select
            label="Especialidad"
            value={form.especialidadId}
            onChange={(v) => setForm({ ...form, especialidadId: v, practicaId: "" })}
            opciones={especialidades.map((e) => ({ value: e._id, label: e.nombre }))}
            placeholder="Todas"
          />
          <Select
            label="Práctica"
            value={form.practicaId}
            onChange={(v) => setForm({ ...form, practicaId: v, especialidadId: "" })}
            opciones={practicas.map((p) => ({ value: p._id, label: p.nombre }))}
            placeholder="Todas"
          />
          <Select
            label="Sede"
            value={form.sede}
            onChange={(v) => setForm({ ...form, sede: v })}
            opciones={sedes.map((s) => ({ value: s.nombre, label: s.nombre }))}
            placeholder="Todas"
          />
          <div className="field">
            <label htmlFor="fechaInicio">Desde</label>
            <input
              id="fechaInicio"
              type="date"
              className="input"
              value={form.fechaInicio}
              onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="fechaFin">Hasta</label>
            <input
              id="fechaFin"
              type="date"
              className="input"
              value={form.fechaFin}
              onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
            />
          </div>
        </div>

        <div className="row row--between mt-16">
          <div className="orden" role="group" aria-label="Ordenar resultados">
            <span className="orden__label">Ordenar por</span>
            <SortChip activo={sortBy === "fechaHora"} order={order} onClick={() => cambiarOrden("fechaHora")}>
              Fecha
            </SortChip>
            <SortChip activo={sortBy === "costo"} order={order} onClick={() => cambiarOrden("costo")}>
              Costo
            </SortChip>
          </div>
          <div className="row">
            <button type="button" className="btn btn--ghost" onClick={limpiar}>
              Limpiar
            </button>
            <button type="submit" className="btn btn--primary">
              Aplicar filtros
            </button>
          </div>
        </div>
      </form>

      <div className="row row--between mt-24" aria-live="polite">
        <span className="muted">
          {cargando ? "Buscando…" : `${paginacion.total} turno(s) disponibles`}
        </span>
      </div>

      {cargando ? (
        <div className="mt-16">
          <SkeletonCards cantidad={6} />
        </div>
      ) : turnos.length === 0 ? (
        <EmptyState
          titulo="No encontramos turnos"
          detalle="Probá ampliar el rango de fechas o quitar algún filtro."
        />
      ) : (
        <>
          <div className="grid grid--cards mt-16">
            {turnos.map((turno) => {
              const enCarrito = contiene(turno._id);
              return (
                <TurnoCard
                  key={turno._id}
                  turno={turno}
                  acciones={
                    <>
                      <button
                        className={`btn btn--sm ${enCarrito ? "btn--ghost" : ""}`}
                        onClick={() =>
                          enCarrito ? quitar(turno._id) : agregar(turno)
                        }
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
    </div>
  );
}

// Chip de ordenamiento con ícono de flecha: gris/tenue si está inactivo,
// flecha hacia arriba (asc) o abajo (desc) cuando está activo.
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

function Select({ label, value, onChange, opciones, placeholder }) {
  const id = `sel-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        className="select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {opciones.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
