import Link from "next/link"

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/proveedores", label: "Proveedores" },
  { href: "/productos", label: "Productos" },
  { href: "/ventas", label: "Ventas" },
  { href: "/optimizacion", label: "Optimización" },
]

export default function Header() {
  return (
    <header className="flex items-center justify-between w-full px-8 py-5">
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rotate-3 flex items-center justify-center"
          style={{
            border: "1px solid",
            borderImage: "linear-gradient(135deg, #ff2d55, #00f2ff) 1",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>
        <Link
          href="/"
          className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-medium"
        >
          SISPRO
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[10px] uppercase tracking-[0.3em] text-white/70 hover:text-white/80 transition-colors duration-300 font-satoshi font-medium"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="w-10 h-10 glass rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/5 transition-all duration-300">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
        </svg>
      </div>
    </header>
  )
}
