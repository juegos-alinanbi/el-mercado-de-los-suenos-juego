"use client";

import { useEffect, useRef } from "react";

import { createTone, getSharedAudioContext, runWhenAudioUnlocked } from "@/shared/lib/audio-context";

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
const STOP_FADE_SECONDS = 0.05;

export function useBackgroundMusic(enabled) {
  const timeoutIdRef = useRef(null);
  const isPlayingRef = useRef(false);
  const shouldPlayRef = useRef(false);
  const activeLoopGainsRef = useRef([]);

  useEffect(() => {
    shouldPlayRef.current = enabled;

    function silenceActiveLoops(context) {
      const now = context.currentTime;
      activeLoopGainsRef.current.forEach((gainNode) => {
        try {
          gainNode.gain.cancelScheduledValues(now);
          gainNode.gain.setValueAtTime(gainNode.gain.value, now);
          gainNode.gain.linearRampToValueAtTime(0.0001, now + STOP_FADE_SECONDS);
        } catch {
          // El nodo ya pudo haberse liberado; no hay nada que silenciar.
        }
      });
      activeLoopGainsRef.current = [];
    }

    function scheduleLoop() {
      if (!shouldPlayRef.current) {
        return;
      }

      const context = getSharedAudioContext();
      if (!context) {
        return;
      }

      const loopGain = context.createGain();
      loopGain.gain.setValueAtTime(1, context.currentTime);
      loopGain.connect(context.destination);
      activeLoopGainsRef.current.push(loopGain);

      const now = context.currentTime;

      MELODY_NOTES.forEach((frequency, index) => {
        createTone(context, frequency, now + index * NOTE_DURATION, NOTE_DURATION * 0.82, 0.02, "triangle", loopGain);
      });

      BASS_NOTES.forEach((frequency, index) => {
        createTone(context, frequency, now + index * BASS_NOTE_DURATION, BASS_NOTE_DURATION * 0.92, 0.013, "sine", loopGain);
      });

      timeoutIdRef.current = setTimeout(scheduleLoop, LOOP_DURATION * 1000);
    }

    function begin() {
      if (!shouldPlayRef.current || isPlayingRef.current) {
        return;
      }
      isPlayingRef.current = true;
      scheduleLoop();
    }

    function stopLoop() {
      isPlayingRef.current = false;
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
      const context = getSharedAudioContext();
      if (context) {
        silenceActiveLoops(context);
      }
    }

    if (enabled) {
      runWhenAudioUnlocked(begin);
    } else {
      stopLoop();
    }

    return () => {
      shouldPlayRef.current = false;
      stopLoop();
    };
  }, [enabled]);
}
