"use client";

import { createContext, useContext, useEffect, useState } from "react";

const SessionContext = createContext(null);
const STORAGE_KEY = "sm_session";

/**
 * La cátedra no pide autenticación en esta entrega, así que la "sesión" es
 * simplemente el usuario que el visitante elige para operar (un paciente o un
 * médico). Se guarda en localStorage para que persista entre recargas.
 */
export function SessionProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      if (guardado) setUsuario(JSON.parse(guardado));
    } catch {
      // si el JSON quedó corrupto lo ignoramos
    }
    setListo(true);
  }, []);

  function iniciarSesion(nuevoUsuario) {
    setUsuario(nuevoUsuario);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevoUsuario));
  }

  function cerrarSesion() {
    setUsuario(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <SessionContext.Provider
      value={{
        usuario,
        listo,
        esPaciente: usuario?.tipo === "PACIENTE",
        esMedico: usuario?.tipo === "MEDICO",
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession debe usarse dentro de SessionProvider");
  return ctx;
}
