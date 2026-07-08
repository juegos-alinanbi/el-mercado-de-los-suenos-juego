"use client";

import { useSoundEffects } from "@/shared/lib/use-sound-effects";
import { useMarketGameStore } from "@/features/market-game/model/use-market-game-store";
import { formatCurrency } from "@/shared/lib/format-currency";
import { EmojiIcon } from "@/shared/ui/emoji-icon";
import { RewardTokenDisplay } from "@/shared/ui/reward-token-display";

const steps = [
  { id: "mission", label: "Misión", icon: "thinking" },
  { id: "market", label: "Mercado", icon: "cart" },
  { id: "checkout", label: "Caja", icon: "wallet" },
  { id: "result", label: "Resultado", icon: "star" },
];

export function ProgressSteps({ current }) {
  const currentIndex = steps.findIndex((step) => step.id === current);
  const soundEnabled = useMarketGameStore((state) => state.soundEnabled);
  const toggleSound = useMarketGameStore((state) => state.toggleSound);
  const savedAmount = useMarketGameStore((state) => state.savedAmount);
  const rewardTokens = useMarketGameStore((state) => state.rewardTokens);
  const { playClick, playSuccess } = useSoundEffects(true);

  function handleSoundToggle() {
    if (soundEnabled) {
      playClick();
      toggleSound();
      return;
    }

    toggleSound();
    playSuccess();
  }

  return (
    <div className="rounded-[2rem] border-4 border-white bg-white/78 p-4 shadow-md sm:p-5">
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex justify-center">
          <div className="flex flex-wrap items-end justify-center gap-x-1 gap-y-3">
            {steps.map((step, index) => {
              const isActive = step.id === current;
              const isDone = index < currentIndex;

              return (
                <div key={step.id} className="flex items-end">
                  <div className="flex min-w-[72px] flex-col items-center gap-1 text-center">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full border-4 transition ${
                        isActive
                          ? "scale-110 border-game-coral bg-white shadow-lg"
                          : isDone
                            ? "border-game-grass bg-game-grass/10"
                            : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <EmojiIcon name={step.icon} size={30} />
                    </div>
                    <p className={`text-sm font-bold ${isActive ? "text-game-coral" : isDone ? "text-game-grass" : "text-game-ink/55"}`}>
                      {step.label}
                    </p>
                  </div>
                  {index < steps.length - 1 ? (
                    <div className={`mx-1 mb-5 hidden h-1.5 w-10 rounded-full sm:block lg:w-14 ${isDone ? "bg-game-grass" : "bg-slate-200"}`} />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-game-sun/60 bg-game-sun/10 px-4 py-2 text-sm font-bold text-game-ink shadow-sm">
            <EmojiIcon name="coin" size={18} />
            Ahorro: {formatCurrency(savedAmount)}
          </div>
          <RewardTokenDisplay count={rewardTokens} compact tone="rose" />
          <button
            type="button"
            onClick={handleSoundToggle}
            className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-bold transition ${
              soundEnabled ? "border-game-grass bg-game-grass/10 text-game-grass" : "border-slate-300 bg-slate-50 text-slate-500"
            }`}
          >
            <EmojiIcon name={soundEnabled ? "party" : "cross"} size={18} />
            {soundEnabled ? "Sonido activo" : "Sonido apagado"}
          </button>
        </div>
      </div>
    </div>
  );
}
