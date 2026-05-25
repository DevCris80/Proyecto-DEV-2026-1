import type { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  glow?: "pink" | "lime" | "cyan"
  padding?: string
}

export default function GlassCard({ children, className = "", glow, padding = "p-10" }: GlassCardProps) {
  const glowClass = glow ? `glow-${glow}` : ""

  return (
    <div
      className={`rounded-[3rem] glass glass-hover ${glowClass} ${padding} ${className}`}
    >
      {children}
    </div>
  )
}
