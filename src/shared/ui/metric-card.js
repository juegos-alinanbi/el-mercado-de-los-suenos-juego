import { EmojiIcon } from "@/shared/ui/emoji-icon";

export function MetricCard({ label, value, accent = "amber", icon, detail = null }) {
  const accents = {
    amber: {
      card: "border-game-sun bg-gradient-to-br from-[#fff7d8] via-[#fff1bf] to-[#ffe9a0]",
      badge: "bg-white text-game-sun shadow-[0_8px_18px_rgba(246,189,59,0.22)]",
      glow: "bg-game-sun/20",
    },
    orange: {
      card: "border-game-coral bg-gradient-to-br from-[#fff0ea] via-[#ffe0d3] to-[#ffd0bf]",
      badge: "bg-white text-game-coral shadow-[0_8px_18px_rgba(255,122,89,0.22)]",
      glow: "bg-game-coral/20",
    },
    emerald: {
      card: "border-game-grass bg-gradient-to-br from-[#eefbe8] via-[#e1f8d7] to-[#d3f3ca]",
      badge: "bg-white text-game-grass shadow-[0_8px_18px_rgba(87,199,102,0.22)]",
      glow: "bg-game-grass/20",
    },
    rose: {
      card: "border-game-berry bg-gradient-to-br from-[#fff0f4] via-[#ffdce7] to-[#ffc9da]",
      badge: "bg-white text-game-berry shadow-[0_8px_18px_rgba(245,94,143,0.22)]",
      glow: "bg-game-berry/20",
    },
    sky: {
      card: "border-game-sky bg-gradient-to-br from-[#eef8ff] via-[#dff2ff] to-[#cee9ff]",
      badge: "bg-white text-game-sky shadow-[0_8px_18px_rgba(80,178,255,0.22)]",
      glow: "bg-game-sky/20",
    },
    stone: {
      card: "border-slate-300 bg-gradient-to-br from-white via-slate-50 to-slate-100",
      badge: "bg-white text-slate-500 shadow-[0_8px_18px_rgba(148,163,184,0.18)]",
      glow: "bg-slate-200/70",
    },
  };

  const palette = accents[accent] ?? accents.amber;

  return (
    <article className={`relative overflow-hidden rounded-[1.75rem] border-[3px] px-4 py-4 text-game-ink shadow-[0_10px_24px_rgba(34,38,91,0.08)] ${palette.card}`}>
      <div className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl ${palette.glow}`} />
      <div className="relative flex items-center gap-3">
        {icon ? (
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.1rem] border border-white/80 ${palette.badge}`}>
            <EmojiIcon name={icon} size={30} />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-game-ink/55">{label}</p>
          <p className="mt-1 font-heading text-3xl font-bold leading-none text-game-ink">{value}</p>
          {detail ? <div className="mt-2 text-sm text-game-ink/65">{detail}</div> : null}
        </div>
      </div>
    </article>
  );
}