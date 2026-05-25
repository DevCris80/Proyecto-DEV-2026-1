import Link from "next/link"
import Badge from "@/components/Badge"
import GlassCard from "@/components/GlassCard"

const features = [
  {
    title: "Proveedores",
    desc: "Gestión completa de proveedores con costos de pedido, lead times y niveles de servicio.",
    href: "/proveedores",
    icon: "🏢",
    glow: "pink" as const,
  },
  {
    title: "Productos",
    desc: "Catálogo de productos con control de stock, costos y búsqueda inteligente.",
    href: "/productos",
    icon: "📦",
    glow: "lime" as const,
  },
  {
    title: "Ventas",
    desc: "Registro y seguimiento de ventas con historial completo.",
    href: "/ventas",
    icon: "📊",
    glow: "cyan" as const,
  },
  {
    title: "Optimización",
    desc: "Modelo EOQ de Wilson con alertas de pedido, punto de reorden y stock de seguridad.",
    href: "/optimizacion",
    icon: "⚡",
    glow: "pink" as const,
  },
]

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
      <div className="flex flex-col items-center gap-8 mb-20">
        <Badge>SISPRO v2.0 — Inventory Intelligence</Badge>

        <h1 className="font-clash font-black text-[clamp(4rem,12vw,12rem)] leading-none tracking-[-0.05em] text-center hero-gradient">
          SISPRO
        </h1>

        <div className="flex items-center gap-6">
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-white/30" />
          <span className="text-[1.125rem] uppercase tracking-[0.3em] text-white/80 font-satoshi font-medium">
            Inventory & Optimization
          </span>
          <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-white/30" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full">
        {features.map((f) => (
          <Link key={f.title} href={f.href}>
            <GlassCard glow={f.glow} className="h-full cursor-pointer group" padding="p-8">
              <div className="flex flex-col items-center text-center gap-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                  style={{ background: `rgba(255,255,255,0.1)` }}
                >
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white/90 font-clash mb-2">{f.title}</h3>
                  <p className="text-sm text-white/70 font-satoshi leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  )
}
