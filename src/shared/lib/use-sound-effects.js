"use client";

let sharedAudioContext = null;

function createTone(audioContext, frequency, startAt, duration, volume, type) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);

  gainNode.gain.setValueAtTime(0.0001, startAt);
  gainNode.gain.exponentialRampToValueAtTime(volume, startAt + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.02);
}

export function useSoundEffects(enabled) {
  function getAudioContext() {
    if (typeof window === "undefined") {
      return null;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      return null;
    }

    if (!sharedAudioContext) {
      sharedAudioContext = new AudioContextClass();
    }

    return sharedAudioContext;
  }

  function withAudioContext(playback) {
    if (!enabled) {
      return;
    }

    const context = getAudioContext();
    if (!context) {
      return;
    }

    const runPlayback = () => {
      playback(context);
    };

    if (context.state === "suspended") {
      context.resume().then(runPlayback).catch(() => {});
      return;
    }

    runPlayback();
  }

  function playClick() {
    withAudioContext((context) => {
      const now = context.currentTime;
      createTone(context, 520, now, 0.08, 0.035, "triangle");
    });
  }

  function playCoin() {
    withAudioContext((context) => {
      const now = context.currentTime;
      createTone(context, 880, now, 0.07, 0.03, "sine");
      createTone(context, 1320, now + 0.05, 0.08, 0.02, "triangle");
    });
  }

  function playSuccess() {
    withAudioContext((context) => {
      const now = context.currentTime;
      createTone(context, 523, now, 0.09, 0.03, "triangle");
      createTone(context, 659, now + 0.09, 0.09, 0.03, "triangle");
      createTone(context, 784, now + 0.18, 0.12, 0.035, "triangle");
    });
  }

  function playError() {
    withAudioContext((context) => {
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
