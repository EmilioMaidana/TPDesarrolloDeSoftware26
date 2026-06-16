"use client";

import { useEffect } from "react";

export function Modal({ titulo, onClose, children }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="row row--between" style={{ marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>{titulo}</h3>
          <button
            className="toast__close"
            aria-label="Cerrar"
            onClick={onClose}
            style={{ fontSize: 22 }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
