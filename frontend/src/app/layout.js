import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";

export const metadata = {
  title: "Sweet Medical — Turnos médicos",
  description:
    "Plataforma de gestión de turnos médicos. Buscá profesionales según tu cobertura y reservá en pocos clics.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <Providers>
          <Navbar />
          <main id="contenido">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
