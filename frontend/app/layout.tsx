import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import Header from "@/components/Header"

const satoshi = localFont({
  src: "../public/fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
  display: "swap",
})

const clashGrotesk = localFont({
  src: "../public/fonts/ClashGrotesk-Variable.woff2",
  variable: "--font-clash",
  weight: "200 700",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SISPRO — Sistema de Inventario y Optimización",
  description: "Sistema de gestión de inventario con optimización matemática",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${satoshi.variable} ${clashGrotesk.variable}`}>
      <body className="h-screen flex flex-col mesh-gradient">
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full border border-white/[0.02] animate-float opacity-20" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full border border-white/[0.02] animate-float opacity-15" style={{ animationDelay: "-4s" }} />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full border border-white/[0.01] animate-float opacity-10" style={{ animationDelay: "-2s" }} />
        </div>

        <Header />
        <main className="flex-1 flex flex-col overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  )
}
