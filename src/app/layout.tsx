import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { FloatingSupport } from "@/components/ui/FloatingSupport/FloatingSupport";
import { CookieBanner } from "@/components/ui/CookieBanner/CookieBanner";

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
  title: "Adfork | Crea anuncios virales en segundos",
  description: "La plataforma #1 para crear contenido UGC impulsado por IA. Rápido, auténtico y diseñado para convertir.",
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
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
        <FloatingSupport />
        <CookieBanner />
      </body>
    </html>
  );
}
