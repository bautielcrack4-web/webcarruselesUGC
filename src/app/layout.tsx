import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "UGC Creator | Crea anuncios virales en segundos",
  description: "La plataforma #1 para crear contenido UGC impulsado por IA. Rápido, auténtico y diseñado para convertir.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${outfit.variable} ${inter.variable}`}>
        <div className="nebula-bg" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
