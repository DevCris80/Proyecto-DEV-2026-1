interface BadgeProps {
  children: string
}

export default function Badge({ children }: BadgeProps) {
  return (
    <div className="inline-flex items-center px-4 py-1.5 rounded-full glass text-[11px] uppercase tracking-[0.3em] text-white/80 font-satoshi font-medium animate-shimmer">
      <span className="relative z-10">{children}</span>
    </div>
  )
}
