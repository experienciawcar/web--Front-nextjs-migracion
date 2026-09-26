import type { Metadata } from "next";
import { Urbanist } from "next/font/google";

import FooterComponent from "@/modules/shared/components/FooterComponent";
import NavbarComponent from "@/modules/shared/components/NavbarComponent";

import "./globals.css";

// La itálica hace falta de verdad: el diseño parte varios títulos en dos, con
// la segunda mitad en cursiva ("Nuestros / Datos", "Misión / & visión",
// "¿Qué dicen de / wcar?"). Sin declararla, el navegador la simula inclinando
// la redonda, que no es la misma letra.
const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "WCAR | Compra y vende tu vehículo seguro en Colombia",
  description:
    "Compra, vende y financia vehículos usados con garantía. Peritaje, trámites, seguros y taller en un solo lugar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${urbanist.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <NavbarComponent />
        {children}
        <FooterComponent />
      </body>
    </html>
  );
}
