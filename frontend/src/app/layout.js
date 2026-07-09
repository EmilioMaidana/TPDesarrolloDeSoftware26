import "./globals.css";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";

// Serif humanista solo para títulos de panel.
const serif = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-serif",
  display: "swap",
});
// Sans para cuerpo y controles.
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
// Monoespaciada para todo dato temporal/numérico.
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "Sweet Medical — Turnos médicos",
  description:
    "Plataforma de gestión de turnos médicos. Buscá profesionales según tu cobertura y reservá en pocos clics.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
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
