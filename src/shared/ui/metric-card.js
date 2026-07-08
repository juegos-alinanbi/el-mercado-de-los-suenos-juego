import { EmojiIcon } from "@/shared/ui/emoji-icon";

export function MetricCard({ label, value, accent = "amber", icon, detail = null }) {
  const accents = {
    amber: "bg-game-sun/15 border-game-sun",
    orange: "bg-game-coral/10 border-game-coral",
    emerald: "bg-game-grass/10 border-game-grass",
    rose: "bg-game-berry/10 border-game-berry",
    sky: "bg-game-sky/10 border-game-sky",
    stone: "bg-slate-100 border-slate-300",
  };

  return (
    <article className={`flex items-center gap-3 rounded-[1.5rem] border-2 p-4 text-game-ink ${accents[accent]}`}>
      {icon ? (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
          <EmojiIcon name={icon} size={30} />
        </div>
      ) : null}
      <div className="min-w-0">
        <p className="text-sm font-bold uppercase tracking-wide opacity-70">{label}</p>
        <p className="mt-1 font-heading text-2xl font-bold">{value}</p>
        {detail ? <div className="mt-2">{detail}</div> : null}
      </div>
    </article>
  );
}
