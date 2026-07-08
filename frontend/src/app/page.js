"use client";

import Link from "next/link";
import { useSession } from "@/context/SessionContext";

export default function HomePage() {
  const { usuario, esMedico } = useSession();
  const ctaHref = usuario ? (esMedico ? "/medico" : "/buscar") : "/login";
  const ctaLabel = usuario ? "Ir a mi panel" : "Iniciar sesión";

  return (
    <div className="container page">
      <section className="hero">
        <span className="hero__eyebrow">Turnos médicos online</span>
        <h1>Reservá tu turno médico en pocos clics</h1>
        <p>
          Buscá profesionales por especialidad, práctica o sede y conocé al
          instante cuánto vas a pagar según tu obra social y plan.
        </p>
        <div className="row mt-24">
          <Link href={ctaHref} className="btn btn--primary btn--lg">
            {ctaLabel}
          </Link>
          <Link href="/buscar" className="btn btn--ghost btn--lg">
            Ver turnos disponibles
          </Link>
        </div>
      </section>

      <section className="feature-grid" aria-label="Beneficios">
        <Feature ico="🔎" titulo="Búsqueda clara">
          Filtrá por profesional, especialidad, práctica, sede y fechas.
        </Feature>
        <Feature ico="💳" titulo="Costo transparente">
          Cada turno muestra si está cubierto y el monto exacto a abonar.
        </Feature>
        <Feature ico="🛒" titulo="Preseleccioná">
          Armá una preselección de turnos y revisala antes de reservar.
        </Feature>
        <Feature ico="🔔" titulo="Notificaciones">
          Enterate de confirmaciones, cancelaciones y recordatorios.
        </Feature>
      </section>
    </div>
  );
}

function Feature({ ico, titulo, children }) {
  return (
    <div className="card feature">
      <div className="feature__ico" aria-hidden="true">
        {ico}
      </div>
      <strong>{titulo}</strong>
      <span className="muted" style={{ fontSize: "0.92rem" }}>
        {children}
      </span>
    </div>
  );
}
