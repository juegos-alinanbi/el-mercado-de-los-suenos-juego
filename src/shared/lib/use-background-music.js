"use client";

import { useEffect, useRef } from "react";

import { createTone, getSharedAudioContext } from "@/shared/lib/audio-context";

const NOTE_DURATION = 0.32;

// Melodia sencilla estilo chiptune, en Do mayor pentatonico: una frase que
// sube (llamada) y otra que baja y resuelve (respuesta), pensada para sonar
// alegre pero discreta de fondo sin cansar en partidas largas.
const MELODY_NOTES = [
  261.63, 329.63, 392.0, 329.63, 293.66, 349.23, 329.63, 293.66,
  261.63, 293.66, 329.63, 392.0, 440.0, 392.0, 329.63, 261.63,
  392.0, 329.63, 293.66, 261.63, 293.66, 329.63, 349.23, 329.63,
  293.66, 261.63, 293.66, 329.63, 392.0, 349.23, 329.63, 261.63,
];

const BASS_NOTES = [130.81, 196.0, 130.81, 196.0, 130.81, 196.0, 130.81, 196.0];

const LOOP_DURATION = MELODY_NOTES.length * NOTE_DURATION;
const BASS_NOTE_DURATION = LOOP_DURATION / BASS_NOTES.length;
const UNLOCK_EVENTS = ["pointerdown", "touchend", "keydown"];

export function useBackgroundMusic(enabled) {
  const timeoutIdRef = useRef(null);
  const isPlayingRef = useRef(false);
  const removeRetryListenersRef = useRef(null);

  useEffect(() => {
    function clearRetryListeners() {
      if (removeRetryListenersRef.current) {
        removeRetryListenersRef.current();
        removeRetryListenersRef.current = null;
      }
    }

    function scheduleLoop() {
      const context = getSharedAudioContext();
      if (!context) {
        return;
      }

      const now = context.currentTime;

      MELODY_NOTES.forEach((frequency, index) => {
        createTone(context, frequency, now + index * NOTE_DURATION, NOTE_DURATION * 0.82, 0.02, "triangle");
      });

      BASS_NOTES.forEach((frequency, index) => {
        createTone(context, frequency, now + index * BASS_NOTE_DURATION, BASS_NOTE_DURATION * 0.92, 0.013, "sine");
      });

      timeoutIdRef.current = setTimeout(scheduleLoop, LOOP_DURATION * 1000);
    }

    function begin() {
      if (isPlayingRef.current) {
        return;
      }
      isPlayingRef.current = true;
      clearRetryListeners();
      scheduleLoop();
    }

    function armRetry(context) {
      if (removeRetryListenersRef.current) {
        return;
      }

      const retry = () => {
        if (isPlayingRef.current) {
          clearRetryListeners();
          return;
        }
        context.resume().then(begin).catch(() => {});
      };

      UNLOCK_EVENTS.forEach((eventName) => window.addEventListener(eventName, retry, { passive: true }));
      removeRetryListenersRef.current = () => {
        UNLOCK_EVENTS.forEach((eventName) => window.removeEventListener(eventName, retry));
      };
    }

    function startLoop() {
      const context = getSharedAudioContext();
      if (!context) {
        return;
      }

      if (context.state === "running") {
        begin();
        return;
      }

      context.resume().then(begin).catch(() => {});
      // Respaldo: si el navegador bloqueo el autoplay, arrancamos en la
      // primera interaccion real del usuario, igual que el resto del audio.
      armRetry(context);
    }

    function stopLoop() {
      isPlayingRef.current = false;
      clearRetryListeners();
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    }

    if (enabled) {
      startLoop();
    } else {
      stopLoop();
    }

    return stopLoop;
  }, [enabled]);
}
