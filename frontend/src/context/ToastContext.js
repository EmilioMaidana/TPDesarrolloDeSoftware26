"use client";

import { createContext, useContext, useCallback, useState } from "react";

const ToastContext = createContext(null);

let idSeq = 0;

/**
 * Sistema de avisos (toasts) para dar feedback de cada interacción relevante:
 * confirmaciones de éxito y mensajes de error.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const quitar = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const mostrar = useCallback(
    (mensaje, tipo = "info") => {
      const id = ++idSeq;
      setToasts((prev) => [...prev, { id, mensaje, tipo }]);
      setTimeout(() => quitar(id), 4000);
    },
    [quitar]
  );

  const exito = useCallback((m) => mostrar(m, "exito"), [mostrar]);
  const error = useCallback((m) => mostrar(m, "error"), [mostrar]);

  return (
    <ToastContext.Provider value={{ mostrar, exito, error }}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.tipo}`}>
            <span>{t.mensaje}</span>
            <button
              className="toast__close"
              aria-label="Cerrar aviso"
              onClick={() => quitar(t.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de ToastProvider");
  return ctx;
}
