import { EmojiIcon } from "@/shared/ui/emoji-icon";

const tones = {
  neutral: { style: "bg-white border-slate-200 text-game-ink", icon: "thinking" },
  success: { style: "bg-game-grass/10 border-game-grass text-game-ink", icon: "check" },
  warning: { style: "bg-game-sun/15 border-game-sun text-game-ink", icon: "cat-worried" },
  danger: { style: "bg-game-berry/10 border-game-berry text-game-ink", icon: "cross" },
};

export function StatusBanner({ message, tone = "neutral" }) {
  const { style, icon } = tones[tone];

  return (
    <div className={`animate-pop-in flex items-center gap-3 rounded-2xl border-2 px-4 py-3 font-semibold ${style}`}>
      <EmojiIcon name={icon} size={26} />
      <p className="text-base leading-6">{message}</p>
    </div>
  );
}
