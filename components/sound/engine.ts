/**
 * ODDLY sound: optional, off by default, synthesised in the browser (no audio
 * files). Three voices:
 *  - room:  a very quiet, slowly breathing pad, like air in a studio
 *  - scene: a soft clay "tok" when the page settles into a new scene
 *  - touch: a tiny tick on hover and a rounder tap on press
 * Nothing is created until the visitor turns sound on (a user gesture), and
 * the context is suspended whenever the tab is hidden.
 */

import { sceneIdAt, track } from "@/components/scene/track";

const KEY = "oddly-sound";
// A pentatonic set in D, so any two scene notes sit well together.
const SCALE = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25];

type Listener = (on: boolean) => void;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private room: { gain: GainNode; stop: () => void } | null = null;
  private on = false;
  private listeners = new Set<Listener>();
  private raf = 0;
  private lastScene = "";
  private lastTick = 0;

  get enabled() {
    return this.on;
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  /** Remembered preference; sound never starts without a click this session. */
  storedPreference() {
    try {
      return localStorage.getItem(KEY) === "on";
    } catch {
      return false;
    }
  }

  async setEnabled(on: boolean) {
    this.on = on;
    try {
      localStorage.setItem(KEY, on ? "on" : "off");
    } catch {
      /* storage blocked: preference lasts for this page only */
    }
    if (on) await this.start();
    else this.stop();
    this.listeners.forEach((fn) => fn(on));
  }

  private async start() {
    if (!this.ctx) {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.ctx.destination);
      document.addEventListener("visibilitychange", this.onVisibility);
      document.addEventListener("pointerover", this.onOver, { passive: true });
      document.addEventListener("pointerdown", this.onDown, { passive: true });
    }
    await this.ctx.resume();
    const now = this.ctx.currentTime;
    this.master!.gain.cancelScheduledValues(now);
    this.master!.gain.setTargetAtTime(0.9, now, 0.4);
    if (!this.room) this.room = this.makeRoom();
    this.lastScene = this.currentScene();
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(this.watch);
  }

  private stop() {
    cancelAnimationFrame(this.raf);
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(0, now, 0.15);
    window.setTimeout(() => {
      if (!this.on) void this.ctx?.suspend();
    }, 600);
  }

  private onVisibility = () => {
    if (!this.ctx) return;
    if (document.hidden) void this.ctx.suspend();
    else if (this.on) void this.ctx.resume();
  };

  private currentScene() {
    return sceneIdAt(track.t > 0.5 ? track.to : track.from);
  }

  /* Scene watcher: a soft note each time the page settles somewhere new. */
  private watch = () => {
    const id = this.currentScene();
    if (id !== this.lastScene) {
      this.lastScene = id;
      const i = Math.max(0, track.holds.findIndex((h) => h.id === id));
      this.tok(SCALE[i % SCALE.length]);
    }
    this.raf = requestAnimationFrame(this.watch);
  };

  /* Room tone: two detuned soft waves through a low filter, breathing slowly. */
  private makeRoom() {
    const ctx = this.ctx!;
    const gain = ctx.createGain();
    gain.gain.value = 0.0;
    gain.gain.setTargetAtTime(0.028, ctx.currentTime, 2.5);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 520;
    filter.Q.value = 0.4;
    const a = ctx.createOscillator();
    const b = ctx.createOscillator();
    a.type = "sine";
    b.type = "triangle";
    a.frequency.value = 73.42; // D2
    b.frequency.value = 110.3; // A2, slightly sharp: a slow beat
    const lfo = ctx.createOscillator();
    const depth = ctx.createGain();
    lfo.frequency.value = 0.06;
    depth.gain.value = 0.012;
    lfo.connect(depth).connect(gain.gain);
    a.connect(filter);
    b.connect(filter);
    filter.connect(gain).connect(this.master!);
    a.start();
    b.start();
    lfo.start();
    return {
      gain,
      stop: () => {
        a.stop();
        b.stop();
        lfo.stop();
      },
    };
  }

  /* A muted clay "tok": a sine with a fast attack and a short, warm decay. */
  private tok(freq: number, level = 0.12) {
    const ctx = this.ctx;
    if (!ctx || !this.on || ctx.state !== "running") return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const body = ctx.createOscillator();
    const env = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = "sine";
    body.type = "triangle";
    osc.frequency.setValueAtTime(freq, t);
    body.frequency.setValueAtTime(freq * 2.01, t);
    filter.type = "lowpass";
    filter.frequency.value = 1800;
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(level, t + 0.006);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    osc.connect(filter);
    body.connect(filter);
    filter.connect(env).connect(this.master!);
    osc.start(t);
    body.start(t);
    osc.stop(t + 1);
    body.stop(t + 1);
  }

  /* Interface: a tiny tick on hovering a control, a rounder tap on press. */
  private interactive(target: EventTarget | null) {
    return target instanceof Element ? target.closest("a, button, summary, [role=button]") : null;
  }

  private onOver = (e: PointerEvent) => {
    if (!this.on || e.pointerType !== "mouse") return;
    const el = this.interactive(e.target);
    if (!el) return;
    const now = performance.now();
    if (now - this.lastTick < 70) return;
    this.lastTick = now;
    this.tok(1318.5, 0.025);
  };

  private onDown = (e: PointerEvent) => {
    if (!this.on || !this.interactive(e.target)) return;
    this.tok(659.25, 0.07);
  };
}

export const sound = new SoundEngine();
