"use client";

let sharedAudioContext = null;
let unlockListenersAttached = false;
let hasWarnedUnsupported = false;
let pendingUnlockCallbacks = [];

// pointerdown cubre mouse/touch/pen en navegadores modernos, pero se agregan
// click y mousedown como respaldo por si algun navegador no lo dispara igual.
const UNLOCK_EVENTS = ["pointerdown", "mousedown", "touchend", "keydown", "click"];

function getAudioContextClass() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.AudioContext || window.webkitAudioContext || null;
}

function flushPendingUnlockCallbacks() {
  const callbacks = pendingUnlockCallbacks;
  pendingUnlockCallbacks = [];
  callbacks.forEach((callback) => {
    try {
      callback();
    } catch (error) {
      console.warn("[audio] Fallo al ejecutar un callback tras desbloquear el audio.", error);
    }
  });
}

function attachUnlockListeners(audioContext) {
  if (unlockListenersAttached || typeof window === "undefined") {
    return;
  }

  unlockListenersAttached = true;

  const tryResume = () => {
    if (audioContext.state === "suspended") {
      audioContext
        .resume()
        .then(flushPendingUnlockCallbacks)
        .catch((error) => {
          console.warn("[audio] El navegador no permitio reanudar el audio tras la interaccion del usuario.", error);
        });
      return;
    }

    if (audioContext.state === "running" && pendingUnlockCallbacks.length > 0) {
      flushPendingUnlockCallbacks();
    }
  };

  // Algunos navegadores (sobre todo movil/Safari) dejan el AudioContext
  // suspendido aunque el resume() se dispare desde un boton concreto. Este
  // listener global reintenta el desbloqueo con la primera interaccion real,
  // que es donde suele fallar el audio en produccion pero no en local.
  UNLOCK_EVENTS.forEach((eventName) => {
    window.addEventListener(eventName, tryResume, { passive: true });
  });
}

export function getSharedAudioContext() {
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

export function createTone(audioContext, frequency, startAt, duration, volume, type, destinationNode) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);

  gainNode.gain.setValueAtTime(0.0001, startAt);
  gainNode.gain.exponentialRampToValueAtTime(volume, startAt + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  oscillator.connect(gainNode);
  gainNode.connect(destinationNode ?? audioContext.destination);

  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.02);
}

export function withAudioContext(enabled, playback) {
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
      console.warn("[audio] Fallo al reproducir audio.", error);
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

// Ejecuta `callback` en cuanto el AudioContext compartido este realmente
// "running". Si ya lo esta, corre de inmediato; si no, queda encolado y se
// dispara junto con el resto del audio del juego en la primera interaccion
// real del usuario (mismo mecanismo global que ya desbloquea los efectos).
export function runWhenAudioUnlocked(callback) {
  const context = getSharedAudioContext();
  if (!context) {
    return;
  }

  if (context.state === "running") {
    callback();
    return;
  }

  pendingUnlockCallbacks.push(callback);
  context.resume().then(flushPendingUnlockCallbacks).catch(() => {});
}
