"use client";

import { useRouter } from "next/navigation";

import { isLevelUnlocked } from "@/features/market-game/domain/game-rules";
import { useMarketGameStore } from "@/features/market-game/model/use-market-game-store";
import { useSoundEffects } from "@/shared/lib/use-sound-effects";
import { EmojiIcon } from "@/shared/ui/emoji-icon";

const otherLevels = [
  { id: "level-2", icon: "party", label: "Nivel 2", hint: "Fiesta grande" },
  { id: "level-3", icon: "apple", label: "Nivel 3", hint: "Reparto entre amigos" },
];

export function LevelPicker() {
  const router = useRouter();
  const levels = useMarketGameStore((state) => state.levels);
  const completedLevels = useMarketGameStore((state) => state.completedLevels);
  const selectLevel = useMarketGameStore((state) => state.selectLevel);
  const soundEnabled = useMarketGameStore((state) => state.soundEnabled);
  const { playClick, playError } = useSoundEffects(soundEnabled);

  function handleSelect(levelId) {
    if (!isLevelUnlocked(levels, levelId, completedLevels)) {
      playError();
      return;
    }

    playClick();
    selectLevel(levelId);
    router.push("/mission");
  }

  return (
    <>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
        <button
          type="button"
          onClick={() => handleSelect("level-1")}
          className="relative inline-flex items-center gap-3 rounded-full border-b-[8px] border-[#c73f24] bg-gradient-to-b from-[#ff9b79] to-game-coral px-10 py-4 font-heading text-2xl font-extrabold tracking-wide text-white shadow-[0_18px_30px_rgba(255,107,87,0.35)] transition-all hover:-translate-y-1 hover:brightness-105 active:translate-y-2 active:border-b-2 sm:px-12 sm:text-3xl"
        >
          <EmojiIcon name="cart" size={32} />
          Jugar ahora
        </button>

        <div className="inline-flex items-center gap-2 rounded-full border-2 border-game-grass/35 bg-white/75 px-4 py-3 text-sm font-bold text-game-ink shadow-sm">
          <EmojiIcon name="abacus" size={22} />
          Aprende suma, resta, multiplicación y cambio
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
        <span className="text-xs font-bold uppercase tracking-wide text-game-ink/50">Otros niveles:</span>
        {otherLevels.map((level) => {
          const unlocked = isLevelUnlocked(levels, level.id, completedLevels);

          return (
            <button
              key={level.id}
              type="button"
              onClick={() => handleSelect(level.id)}
              className={`inline-flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-sm font-bold shadow-sm transition ${
                unlocked
                  ? "border-white bg-white/70 text-game-ink hover:-translate-y-0.5 hover:bg-white"
                  : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
              }`}
            >
              <EmojiIcon name={unlocked ? level.icon : "lock"} size={18} />
              {level.label} - {unlocked ? level.hint : "Completa el nivel anterior"}
            </button>
          );
        })}
      </div>
    </>
  );
}
