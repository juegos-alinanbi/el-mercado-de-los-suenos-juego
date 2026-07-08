"use client";

let sharedAudioContext = null;
let unlockListenersAttached = false;
let hasWarnedUnsupported = false;

function getAudioContextClass() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.AudioContext || window.webkitAudioContext || null;
}

function attachUnlockListeners(audioContext) {
  if (unlockListenersAttached || typeof window === "undefined") {
    return;
  }

  unlockListenersAttached = true;

  const tryResume = () => {
    if (audioContext.state === "suspended") {
      audioContext.resume().catch((error) => {
        console.warn("[audio] El navegador no permitio reanudar el audio tras la interaccion del usuario.", error);
      });
    }
  };

  // Algunos navegadores (sobre todo movil/Safari) dejan el AudioContext
  // suspendido aunque el resume() se dispare desde un boton concreto. Este
  // listener global reintenta el desbloqueo con la primera interaccion real,
  // que es donde suele fallar el audio en produccion pero no en local.
  ["pointerdown", "touchend", "keydown"].forEach((eventName) => {
    window.addEventListener(eventName, tryResume, { passive: true });
  });
}

function getSharedAudioContext() {
  if (sharedAudioContext) {
    return sharedAudioContext;
  }

  const AudioContextClass = getAudioContextClass();

  if (!AudioContextClass) {
    if (!hasWarnedUnsupported) {
      console.warn("[audio] Este navegador no soporta Web Audio API. El juego seguira funcionando sin sonido.");
      hasWarnedUnsupported = true;
    }
    return null;
  }

  try {
    sharedAudioContext = new AudioContextClass();
  } catch (error) {
    console.warn("[audio] No se pudo crear el AudioContext.", error);
    return null;
  }

  attachUnlockListeners(sharedAudioContext);
  return sharedAudioContext;
}

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
  function withAudioContext(playback) {
    if (!enabled) {
      return;
    }

    const context = getSharedAudioContext();
    if (!context) {
      return;
    }

    const runPlayback = () => {
      try {
        playback(context);
      } catch (error) {
        console.warn("[audio] Fallo al reproducir un efecto de sonido.", error);
      }
    };

    if (context.state === "suspended") {
      context
        .resume()
        .then(runPlayback)
        .catch((error) => {
          console.warn(
            "[audio] El navegador bloqueo la reanudacion del audio (politica de autoplay). Sonara en la siguiente interaccion.",
            error,
          );
        });
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
