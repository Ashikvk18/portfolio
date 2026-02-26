"use client";

import { createContext, useContext, useCallback, useEffect, useRef, useState } from "react";

// ── Music tracks ──
// Place MP3 files in /public/audio/ and list them here.
// Recommended: Harry Potter soundtrack instrumentals or HP-inspired ambient music.
const MUSIC_TRACKS = [
  "/audio/track1.mp3",
  "/audio/track2.mp3",
];

// ── Types ──
interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playHover: () => void;
  playClick: () => void;
  playSpell: () => void;
  playTransition: () => void;
  startAmbient: () => void;
  stopAmbient: () => void;
}

const SoundContext = createContext<SoundContextType>({
  isMuted: true,
  toggleMute: () => {},
  playHover: () => {},
  playClick: () => {},
  playSpell: () => {},
  playTransition: () => {},
  startAmbient: () => {},
  stopAmbient: () => {},
});

export const useSound = () => useContext(SoundContext);

// ── Audio Context singleton for SFX ──
let audioCtx: AudioContext | null = null;
const getAudioCtx = () => {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
};

// ── Helper: play a note ──
function playTone(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  volume: number = 0.1,
  type: OscillatorType = "sine",
  delay: number = 0
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
  gain.gain.setValueAtTime(0, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
}

// ── Helper: play noise burst (whoosh) ──
function playNoise(
  ctx: AudioContext,
  duration: number,
  volume: number = 0.05,
  delay: number = 0
) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(2000, ctx.currentTime + delay);
  filter.Q.setValueAtTime(0.5, ctx.currentTime + delay);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(ctx.currentTime + delay);
}

// ── Global music singleton (survives React re-renders & Strict Mode) ──
let globalAudio: HTMLAudioElement | null = null;
let musicStarted = false;
const VOLUME = 0.4;

function ensureMusic() {
  if (musicStarted) return;
  if (!globalAudio) {
    globalAudio = document.createElement("audio");
    globalAudio.loop = true;
    globalAudio.volume = VOLUME;
    globalAudio.preload = "auto";

    // Start playing as soon as enough data is buffered
    globalAudio.addEventListener("canplay", () => {
      if (!musicStarted) {
        globalAudio!.play().then(() => {
          musicStarted = true;
        }).catch(() => {});
      }
    });

    // Set src last to trigger loading
    globalAudio.src = MUSIC_TRACKS[0];
    globalAudio.load(); // Force immediate download
  }
  globalAudio.play().then(() => {
    musicStarted = true;
  }).catch(() => {});
}

function setupAutoplay() {
  ensureMusic();

  // These are "user activation" events that browsers trust for audio playback
  const events = ["click", "keydown", "touchstart", "touchend", "pointerdown", "pointerup", "mousedown"];
  const cleanup = () => {
    events.forEach((e) => document.removeEventListener(e, handler, true));
    // Remove overlay if it exists
    const overlay = document.getElementById("audio-trigger-overlay");
    if (overlay) overlay.remove();
  };
  const handler = () => {
    if (!globalAudio) ensureMusic();
    if (globalAudio && !musicStarted) {
      globalAudio.play().then(() => {
        musicStarted = true;
        cleanup();
      }).catch(() => {});
    } else if (musicStarted) {
      cleanup();
    }
  };
  // Use capture phase so we intercept the event before anything else
  events.forEach((e) => document.addEventListener(e, handler, { capture: true, passive: true }));

  // Create an invisible full-screen overlay to guarantee the first touch/tap triggers audio
  // This catches taps that might land on non-interactive areas
  const overlay = document.createElement("div");
  overlay.id = "audio-trigger-overlay";
  overlay.style.cssText = "position:fixed;inset:0;z-index:9999;opacity:0;cursor:default;";
  overlay.addEventListener("touchstart", handler, { passive: true });
  overlay.addEventListener("click", (e) => {
    handler();
    // Let the click pass through to elements below
    overlay.remove();
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
    if (el) el.click();
  });
  // Auto-remove after 10 seconds if music already started via other means
  setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 10000);
  document.body.appendChild(overlay);
}

export default function SoundProvider({ children }: { children: React.ReactNode }) {
  const mutedRef = useRef(false);

  // ── Start music once on mount ──
  useEffect(() => {
    setupAutoplay();
  }, []);

  // ── No toggle needed — always on ──
  const toggleMute = useCallback(() => {}, []);

  // ── Hover sound: soft magical chime ──
  const playHover = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = getAudioCtx();
    const notes = [1200, 1800];
    const note = notes[Math.floor(Math.random() * notes.length)];
    playTone(ctx, note + Math.random() * 200, 0.15, 0.03, "sine");
  }, []);

  // ── Click sound: wand tap ──
  const playClick = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = getAudioCtx();
    playTone(ctx, 800, 0.08, 0.06, "triangle");
    playTone(ctx, 1600, 0.06, 0.03, "sine", 0.02);
    playNoise(ctx, 0.04, 0.04);
  }, []);

  // ── Spell cast: ascending magical arpeggio ──
  const playSpell = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = getAudioCtx();
    const notes = [523, 659, 784, 988, 1175];
    notes.forEach((note, i) => {
      playTone(ctx, note, 0.3 - i * 0.04, 0.04 - i * 0.005, "sine", i * 0.06);
    });
    playNoise(ctx, 0.5, 0.02, 0.1);
    playTone(ctx, 262, 0.8, 0.02, "sine", 0.2);
  }, []);

  // ── Section transition: deep mystical tone ──
  const playTransition = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(130, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.8);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
    playTone(ctx, 392, 0.6, 0.02, "sine", 0.15);
    playTone(ctx, 523, 0.5, 0.015, "sine", 0.3);
  }, []);

  // ── Start/stop ambient (kept for API compatibility) ──
  const startAmbient = useCallback(() => {
    if (globalAudio) globalAudio.play().catch(() => {});
  }, []);

  const stopAmbient = useCallback(() => {
    if (globalAudio) globalAudio.pause();
  }, []);

  return (
    <SoundContext.Provider
      value={{
        isMuted: false,
        toggleMute,
        playHover,
        playClick,
        playSpell,
        playTransition,
        startAmbient,
        stopAmbient,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}
