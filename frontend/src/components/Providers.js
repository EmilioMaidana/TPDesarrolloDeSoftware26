"use client";

import { SessionProvider } from "@/context/SessionContext";
import { CarritoProvider } from "@/context/CarritoContext";
import { ToastProvider } from "@/context/ToastContext";

export function Providers({ children }) {
  return (
    <ToastProvider>
      <SessionProvider>
        <CarritoProvider>{children}</CarritoProvider>
      </SessionProvider>
    </ToastProvider>
  );
}
