"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CarritoContext = createContext(null);
const STORAGE_KEY = "sm_carrito";

/**
 * Carrito de preselección de turnos. Vive 100% en el cliente (no se persiste
 * en el backend, tal como pide la consigna). Permite preseleccionar varios
 * turnos disponibles, ver el resumen y quitarlos.
 */
export function CarritoProvider({ children }) {
  const [items, setItems] = useState([]);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      if (guardado) setItems(JSON.parse(guardado));
    } catch {
      // ignorar
    }
    setListo(true);
  }, []);

  useEffect(() => {
    if (listo) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, listo]);

  function agregar(turno) {
    setItems((prev) => {
      if (prev.some((t) => t._id === turno._id)) return prev; // sin duplicados
      return [...prev, turno];
    });
  }

  function quitar(turnoId) {
    setItems((prev) => prev.filter((t) => t._id !== turnoId));
  }

  function vaciar() {
    setItems([]);
  }

  function contiene(turnoId) {
    return items.some((t) => t._id === turnoId);
  }

  const total = useMemo(
    () =>
      items.reduce(
        (acc, t) => acc + (t?.cotizacion?.costoFinal ?? t?.costo ?? 0),
        0
      ),
    [items]
  );

  return (
    <CarritoContext.Provider
      value={{ items, cantidad: items.length, total, agregar, quitar, vaciar, contiene }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return ctx;
}
