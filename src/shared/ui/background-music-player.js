"use client";

import { useMarketGameStore } from "@/features/market-game/model/use-market-game-store";
import { useBackgroundMusic } from "@/shared/lib/use-background-music";

export function BackgroundMusicPlayer() {
  const musicEnabled = useMarketGameStore((state) => state.musicEnabled);
  useBackgroundMusic(musicEnabled);
  return null;
}
