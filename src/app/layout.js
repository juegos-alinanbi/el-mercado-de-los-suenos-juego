import { Baloo_2, Nunito } from "next/font/google";

import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-body",
});

export const metadata = {
  title: "El Mercado de los Suenos",
  description: "Mini juego educativo de matematica con Michi Money.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`h-full antialiased ${baloo.variable} ${nunito.variable}`}
    >
      {/*
        suppressHydrationWarning solo aplica a los atributos de este <body>, no a sus hijos:
        no oculta mismatches de hidratacion del contenido del juego, solo evita el warning
        cuando extensiones del navegador inyectan atributos aqui (ej. cz-shortcut-listen).
      */}
      <body
        className="min-h-full bg-background text-foreground"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
