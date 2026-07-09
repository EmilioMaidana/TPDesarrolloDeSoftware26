"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Stethoscope, User, Menu } from "lucide-react";
import { useSession } from "@/context/SessionContext";
import { useCarrito } from "@/context/CarritoContext";

export function Navbar() {
  const { usuario, esPaciente, esMedico, cerrarSesion } = useSession();
  const { cantidad } = useCarrito();
  const pathname = usePathname();
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);

  function salir() {
    cerrarSesion();
    setAbierto(false);
    router.push("/login");
  }

  const links = [{ href: "/", label: "Inicio" }];
  if (!esMedico) {
    links.push({ href: "/buscar", label: "Buscar turnos" });
  }
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
          <span className="brand__dot" aria-hidden="true">
            <Plus size={18} strokeWidth={2.5} />
          </span>
          Sweet Medical
        </Link>

        <button
          className="nav-toggle"
          aria-label="Abrir menú"
          aria-expanded={abierto}
          onClick={() => setAbierto((v) => !v)}
        >
          <Menu size={20} />
        </button>

        <nav
          className={`navlinks ${abierto ? "navlinks--open" : ""}`}
          aria-label="Navegación principal"
        >
          <span className="nav-spacer" />

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

          {usuario ? (
            <div className="nav-user">
              <span className="nav-user__chip" title={usuario.nombre}>
                {esMedico ? (
                  <Stethoscope size={15} aria-hidden="true" />
                ) : (
                  <User size={15} aria-hidden="true" />
                )}
                {primerNombre(usuario.nombre)}
              </span>
              <button type="button" className="btn btn--ghost btn--sm" onClick={salir}>
                Salir
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn btn--primary btn--sm"
              onClick={() => setAbierto(false)}
            >
              Iniciar sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function primerNombre(nombre = "") {
  return nombre.replace(/^(Dr\.|Dra\.)\s*/i, "").split(" ")[0] || nombre;
}
