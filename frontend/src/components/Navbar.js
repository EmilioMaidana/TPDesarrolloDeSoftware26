"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/context/SessionContext";
import { useCarrito } from "@/context/CarritoContext";

export function Navbar() {
  const { usuario, esPaciente, esMedico } = useSession();
  const { cantidad } = useCarrito();
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);

  const links = [{ href: "/", label: "Inicio" }, { href: "/buscar", label: "Buscar turnos" }];
  if (esPaciente) {
    links.push({ href: "/mis-turnos", label: "Mis turnos" });
    links.push({ href: "/carrito", label: "Preselección", badge: cantidad });
  }
  if (esMedico) {
    links.push({ href: "/medico", label: "Panel médico" });
  }
  if (usuario) {
    links.push({ href: "/notificaciones", label: "Notificaciones" });
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link href="/" className="brand" onClick={() => setAbierto(false)}>
          <span className="brand__dot" aria-hidden="true">✚</span>
          Sweet Medical
        </Link>

        <button
          className="nav-toggle"
          aria-label="Abrir menú"
          aria-expanded={abierto}
          onClick={() => setAbierto((v) => !v)}
        >
          ☰
        </button>

        <nav
          className={`navlinks ${abierto ? "navlinks--open" : ""}`}
          aria-label="Navegación principal"
        >
          {links.map((l) => {
            const activo =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`navlink ${activo ? "navlink--active" : ""}`}
                aria-current={activo ? "page" : undefined}
                onClick={() => setAbierto(false)}
              >
                {l.label}
                {l.badge > 0 && <span className="nav-count">{l.badge}</span>}
              </Link>
            );
          })}

          <span className="nav-spacer" />

          <Link
            href="/"
            className="navlink"
            onClick={() => setAbierto(false)}
            title="Cambiar de usuario"
          >
            {usuario ? `👤 ${primerNombre(usuario.nombre)}` : "Elegir usuario"}
          </Link>
        </nav>
      </div>
    </header>
  );
}

function primerNombre(nombre = "") {
  return nombre.replace(/^(Dr\.|Dra\.)\s*/i, "").split(" ")[0] || nombre;
}
