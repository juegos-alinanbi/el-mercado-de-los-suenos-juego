"use client";

export function ActionButton({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
  type = "button",
}) {
  const variants = {
    primary: "bg-game-coral text-white border-[#c7381f] hover:brightness-[1.06]",
    secondary: "bg-white text-game-ink border-slate-300 hover:brightness-[1.03]",
    success: "bg-game-grass text-white border-[#2c8a49] hover:brightness-[1.06]",
    danger: "bg-game-berry text-white border-[#c73f68] hover:brightness-[1.06]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl border-b-[6px] px-7 py-3.5 font-heading text-lg font-bold tracking-wide transition-all active:translate-y-1 active:border-b-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100 disabled:active:translate-y-0 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
