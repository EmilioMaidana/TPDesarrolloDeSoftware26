"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { useToast } from "@/context/ToastContext";
import { login, mensajeDeError } from "@/lib/api";

const DEMO = [
  { nombreUsuario: "paciente.juan", rol: "Paciente", nombre: "Juan Domínguez", emoji: "👤" },
  { nombreUsuario: "paciente.maria", rol: "Paciente", nombre: "María López", emoji: "👤" },
  { nombreUsuario: "dr.gomez", rol: "Médico", nombre: "Dr. Carlos Gómez", emoji: "🩺" },
  { nombreUsuario: "dra.perez", rol: "Médico", nombre: "Dra. Ana Pérez", emoji: "🩺" },
];

export default function LoginPage() {
  const router = useRouter();
  const { iniciarSesion } = useSession();
  const { error } = useToast();

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  async function ingresar(usuario, pass) {
    setCargando(true);
    try {
      const perfil = await login(usuario, pass);
      iniciarSesion(perfil);
      router.push(perfil.tipo === "MEDICO" ? "/medico" : "/buscar");
    } catch (e) {
      error(mensajeDeError(e, "No se pudo iniciar sesión"));
      setCargando(false);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!nombreUsuario || !password) {
      error("Completá usuario y contraseña.");
      return;
    }
    ingresar(nombreUsuario, password);
  }

  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__brand">
          <span className="brand__dot" aria-hidden="true">✚</span>
          Sweet Medical
        </div>
        <h1 className="auth__title">Iniciar sesión</h1>
        <p className="muted">Ingresá con tu usuario para reservar y gestionar tus turnos.</p>

        <form onSubmit={onSubmit} className="stack mt-24">
          <div className="field">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              className="input"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              placeholder="paciente.juan"
              autoComplete="username"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
              autoComplete="current-password"
            />
          </div>
          <button className="btn btn--primary btn--block" disabled={cargando}>
            {cargando ? "Ingresando…" : "Ingresar"}
          </button>
        </form>

        <div className="auth__demo">
          <div className="auth__demo-sep">
            <span>Usuarios de demo · contraseña <code>123</code></span>
          </div>
          <div className="auth__demo-grid">
            {DEMO.map((u) => (
              <button
                key={u.nombreUsuario}
                type="button"
                className="auth__demo-btn"
                onClick={() => ingresar(u.nombreUsuario, "123")}
                disabled={cargando}
              >
                <span className="auth__demo-avatar" aria-hidden="true">{u.emoji}</span>
                <span className="auth__demo-info">
                  <strong>{u.nombre}</strong>
                  <span className="muted">{u.rol} · {u.nombreUsuario}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
