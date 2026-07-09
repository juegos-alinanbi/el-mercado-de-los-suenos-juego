"use client";

import { createTone, withAudioContext } from "@/shared/lib/audio-context";

export function useSoundEffects(enabled) {
  function playClick() {
    withAudioContext(enabled, (context) => {
      const now = context.currentTime;
      createTone(context, 520, now, 0.08, 0.035, "triangle");
    });
  }

  function playCoin() {
    withAudioContext(enabled, (context) => {
      const now = context.currentTime;
      createTone(context, 880, now, 0.07, 0.03, "sine");
      createTone(context, 1320, now + 0.05, 0.08, 0.02, "triangle");
    });
  }

  function playSuccess() {
    withAudioContext(enabled, (context) => {
      const now = context.currentTime;
      createTone(context, 523, now, 0.09, 0.03, "triangle");
      createTone(context, 659, now + 0.09, 0.09, 0.03, "triangle");
      createTone(context, 784, now + 0.18, 0.12, 0.035, "triangle");
    });
  }

  function playError() {
    withAudioContext(enabled, (context) => {
      const now = context.currentTime;
      createTone(context, 320, now, 0.12, 0.03, "sawtooth");
      createTone(context, 220, now + 0.1, 0.12, 0.025, "sawtooth");
    });
  }

  return {
    playClick,
    playCoin,
    playSuccess,
    playError,
  };
}
