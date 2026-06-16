"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { useToast } from "@/context/ToastContext";
import { getPacientes, getMedicos, mensajeDeError } from "@/lib/api";
import { Spinner } from "@/components/Estados";

/**
 * Selector de usuario. Como la consigna no pide login en estas entregas,
 * permitimos elegir con qué paciente o médico operar. La selección se guarda
 * en la sesión (localStorage).
 */
export function UserSwitcher() {
  const { usuario, iniciarSesion, cerrarSesion } = useSession();
  const { error } = useToast();
  const router = useRouter();

  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        const [pac, med] = await Promise.all([getPacientes(), getMedicos()]);
        if (!activo) return;
        setPacientes(pac);
        setMedicos(med);
      } catch (e) {
        error(mensajeDeError(e, "No se pudieron cargar los usuarios. ¿Está el backend levantado?"));
      } finally {
        if (activo) setCargando(false);
      }
    })();
    return () => {
      activo = false;
    };
  }, [error]);

  function entrarComoPaciente(p) {
    iniciarSesion({ tipo: "PACIENTE", id: p._id, usuarioId: p.usuario, nombre: p.nombre });
    router.push("/buscar");
  }

  function entrarComoMedico(m) {
    iniciarSesion({ tipo: "MEDICO", id: m._id, usuarioId: m.usuario, nombre: m.nombre });
    router.push("/medico");
  }

  if (cargando) {
    return (
      <div className="row" style={{ justifyContent: "center", padding: 24 }}>
        <Spinner ink /> <span className="muted">Cargando usuarios…</span>
      </div>
    );
  }

  return (
    <div className="stack">
      {usuario && (
        <div className="row row--between card" style={{ alignItems: "center" }}>
          <span>
            Estás operando como <strong>{usuario.nombre}</strong>{" "}
            <span className="muted">({usuario.tipo.toLowerCase()})</span>
          </span>
          <button className="btn btn--ghost btn--sm" onClick={cerrarSesion}>
            Cambiar
          </button>
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div className="panel">
          <h3>Soy paciente</h3>
          <p className="muted" style={{ fontSize: "0.9rem" }}>
            Elegí tu perfil para buscar y reservar turnos según tu cobertura.
          </p>
          <div className="stack mt-8">
            {pacientes.map((p) => (
              <button
                key={p._id}
                className="btn btn--ghost"
                style={{ justifyContent: "flex-start" }}
                onClick={() => entrarComoPaciente(p)}
              >
                👤 {p.nombre}
              </button>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3>Soy médico</h3>
          <p className="muted" style={{ fontSize: "0.9rem" }}>
            Gestioná tu disponibilidad, servicios y la agenda de turnos.
          </p>
          <div className="stack mt-8">
            {medicos.map((m) => (
              <button
                key={m._id}
                className="btn btn--ghost"
                style={{ justifyContent: "flex-start" }}
                onClick={() => entrarComoMedico(m)}
              >
                🩺 {m.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
