import { EmojiIcon } from "@/shared/ui/emoji-icon";

export function RewardTokenDisplay({ count, maxVisible = 6, size = 18, compact = false, tone = "rose" }) {
  const visibleCount = Math.min(count, maxVisible);
  const hiddenCount = Math.max(0, count - visibleCount);
  const chipTone = {
    rose: "border-game-berry/25 bg-game-berry/10",
    sun: "border-game-sun/40 bg-game-sun/15",
    sky: "border-game-sky/30 bg-game-sky/10",
  };

  if (count <= 0) {
    return (
      <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${chipTone[tone] ?? chipTone.rose}`}>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">
          <EmojiIcon name="star" size={size} />
        </span>
        <span className="text-sm font-bold text-game-ink/65">Aún sin fichas</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${chipTone[tone] ?? chipTone.rose}`}>
      <div className={`flex items-center ${compact ? "-space-x-2" : "-space-x-1.5"}`}>
        {Array.from({ length: visibleCount }).map((_, index) => (
          <span
            key={`${count}-${index}`}
            className="flex items-center justify-center rounded-full border-2 border-white bg-white shadow-sm"
            style={{ width: size + 10, height: size + 10, zIndex: visibleCount - index }}
          >
            <EmojiIcon name="star" size={size} />
          </span>
        ))}
      </div>
      <span className="text-sm font-bold text-game-ink">
        {count} ficha{count === 1 ? "" : "s"}
        {hiddenCount > 0 ? ` (+${hiddenCount})` : ""}
      </span>
    </div>
  );
}
