"use client"

interface GradientButtonProps {
  onClick?: () => void
}

export default function GradientButton({ onClick }: GradientButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-[60px] h-[60px] rounded-full flex items-center justify-center cursor-pointer
        transition-all duration-300 ease-spring
        hover:scale-105 active:scale-95
        shadow-[0_8px_32px_rgba(255,45,85,0.3)]"
      style={{ background: "linear-gradient(to top right, #ff2d55, #00f2ff)" }}
    >
      <svg
        width="24" height="24" viewBox="0 0 24 24"
        fill="none" stroke="white" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        className="group-hover:animate-pulse-dot"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    </button>
  )
}
