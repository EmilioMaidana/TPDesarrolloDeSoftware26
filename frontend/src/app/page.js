"use client";

import Link from "next/link";
import { UserSwitcher } from "@/components/UserSwitcher";

export default function HomePage() {
  return (
    <div className="container page">
      <section className="hero">
        <h1>Reservá tu turno médico en pocos clics</h1>
        <p>
          Buscá profesionales por especialidad, práctica o sede y conocé al
          instante cuánto vas a pagar según tu obra social y plan.
        </p>
        <div className="row mt-16">
          <Link href="/buscar" className="btn btn--primary">
            Buscar turnos
          </Link>
          <a href="#ingresar" className="btn btn--ghost">
            Elegir mi usuario
          </a>
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

      <section id="ingresar" className="mt-24">
        <div className="page__head">
          <h2>Ingresá a la demo</h2>
          <p>Elegí un usuario para comenzar a operar.</p>
        </div>
        <UserSwitcher />
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
