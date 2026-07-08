import { EmojiIcon } from "@/shared/ui/emoji-icon";

export function ProductGlyph({ icon, name, category, tone = "amber" }) {
  const tones = {
    amber: "from-game-sun/50 to-game-sun/10",
    orange: "from-game-coral/40 to-game-coral/10",
    emerald: "from-game-grass/40 to-game-grass/10",
    sky: "from-game-sky/40 to-game-sky/10",
    stone: "from-slate-200 to-slate-100",
  };

  return (
    <div
      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.4rem] bg-gradient-to-br shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] ${tones[tone]}`}
    >
      <EmojiIcon name={icon} size={42} alt={`${name} - ${category}`} />
    </div>
  );
}
