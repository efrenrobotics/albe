/**
 * Shared audio engine for the aniversario journey.
 * Create on the "Abrir" tap (user gesture). Fail silent if music file missing.
 */

import { MUSIC } from "../data/trip";

type SfxKind =
  | "engine"
  | "whoosh"
  | "bells"
  | "train"
  | "splash"
  | "chime"
  | "musicbox";

class AniversarioAudio {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private musicSource: AudioBufferSourceNode | null = null;
  private musicBuffer: AudioBuffer | null = null;
  private ambientSource: AudioBufferSourceNode | null = null;
  private muted = false;
  private musicStarted = false;
  private ducking = false;
  private trainInterval: number | null = null;
  private musicboxNodes: OscillatorNode[] = [];
  private bellsInterval: number | null = null;
  private visibilityHandler: (() => void) | null = null;

  /** Call from the Abrir button click — creates AudioContext under user gesture. */
  async unlock(): Promise<void> {
    if (this.ctx) return;
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new Ctx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 1;
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = MUSIC.volume;
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.7;
      this.sfxGain.connect(this.masterGain);

      this.visibilityHandler = () => {
        if (!this.ctx) return;
        if (document.hidden) {
          void this.ctx.suspend();
        } else if (!this.muted) {
          void this.ctx.resume();
        }
      };
      document.addEventListener("visibilitychange", this.visibilityHandler);

      await this.loadMusic(MUSIC.aeropuerto);
    } catch {
      // Fail silent — no audio available
    }
  }

  private async loadMusic(url: string): Promise<void> {
    if (!this.ctx) return;
    try {
      const res = await fetch(url, { method: "GET" });
      if (!res.ok) return;
      const arr = await res.arrayBuffer();
      this.musicBuffer = await this.ctx.decodeAudioData(arr.slice(0));
    } catch {
      // Missing or undecodable — stay silent
      this.musicBuffer = null;
    }
  }

  /** Start looping Aeropuerto (or stay silent if missing). */
  startMusic(): void {
    if (!this.ctx || !this.musicGain || !this.musicBuffer || this.musicStarted)
      return;
    try {
      this.musicSource = this.ctx.createBufferSource();
      this.musicSource.buffer = this.musicBuffer;
      this.musicSource.loop = true;
      this.musicSource.connect(this.musicGain);
      this.musicSource.start(0);
      this.musicStarted = true;
    } catch {
      // Fail silent
    }
  }

  /** Optional per-city ambient — only if file exists. */
  async playAmbient(url: string | undefined): Promise<void> {
    this.stopAmbient();
    if (!url || !this.ctx || !this.musicGain) return;
    try {
      const res = await fetch(url);
      if (!res.ok) return;
      const arr = await res.arrayBuffer();
      const buf = await this.ctx.decodeAudioData(arr.slice(0));
      this.ambientSource = this.ctx.createBufferSource();
      const g = this.ctx.createGain();
      g.gain.value = 0.2;
      this.ambientSource.buffer = buf;
      this.ambientSource.loop = true;
      this.ambientSource.connect(g);
      g.connect(this.musicGain);
      this.ambientSource.start(0);
    } catch {
      // Optional — ignore
    }
  }

  stopAmbient(): void {
    try {
      this.ambientSource?.stop();
    } catch {
      /* already stopped */
    }
    this.ambientSource = null;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (!this.masterGain || !this.ctx) return;
    this.masterGain.gain.setTargetAtTime(
      muted ? 0 : 1,
      this.ctx.currentTime,
      0.05,
    );
    if (muted) void this.ctx.suspend();
    else if (!document.hidden) void this.ctx.resume();
  }

  isMuted(): boolean {
    return this.muted;
  }

  /** Duck music under big SFX, then restore. */
  duck(durationMs = 2500): void {
    if (!this.musicGain || !this.ctx || this.ducking) return;
    this.ducking = true;
    const now = this.ctx.currentTime;
    this.musicGain.gain.cancelScheduledValues(now);
    this.musicGain.gain.setTargetAtTime(MUSIC.duckedVolume, now, 0.08);
    window.setTimeout(() => {
      if (!this.musicGain || !this.ctx) return;
      this.musicGain.gain.setTargetAtTime(
        MUSIC.volume,
        this.ctx.currentTime,
        0.3,
      );
      this.ducking = false;
    }, durationMs);
  }

  /** Swell music back up for the finale. */
  swell(): void {
    if (!this.musicGain || !this.ctx) return;
    this.musicGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.musicGain.gain.setTargetAtTime(
      Math.min(0.55, MUSIC.volume + 0.15),
      this.ctx.currentTime,
      0.4,
    );
  }

  play(kind: SfxKind): void {
    if (!this.ctx || !this.sfxGain || this.muted) return;
    void this.ctx.resume();
    switch (kind) {
      case "engine":
        this.playEngine();
        break;
      case "whoosh":
        this.playWhoosh();
        break;
      case "bells":
        this.startBells();
        break;
      case "train":
        this.startTrain();
        break;
      case "splash":
        this.playSplash();
        break;
      case "chime":
        this.playChime();
        break;
      case "musicbox":
        this.startMusicBox();
        break;
    }
  }

  stopLoops(): void {
    if (this.trainInterval != null) {
      clearInterval(this.trainInterval);
      this.trainInterval = null;
    }
    if (this.bellsInterval != null) {
      clearInterval(this.bellsInterval);
      this.bellsInterval = null;
    }
    for (const n of this.musicboxNodes) {
      try {
        n.stop();
      } catch {
        /* */
      }
    }
    this.musicboxNodes = [];
  }

  private noiseBuffer(seconds: number): AudioBuffer {
    const ctx = this.ctx!;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  private playEngine(): void {
    const ctx = this.ctx!;
    const out = this.sfxGain!;
    this.duck(4000);

    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(55, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 3.5);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 3);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.4);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4);

    osc.connect(filter);
    filter.connect(g);
    g.connect(out);
    osc.start();
    osc.stop(ctx.currentTime + 4.1);

    // Filtered noise whoosh layer
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(4);
    const nf = ctx.createBiquadFilter();
    nf.type = "bandpass";
    nf.frequency.value = 400;
    nf.Q.value = 0.6;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.0001, ctx.currentTime);
    ng.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.5);
    ng.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4);
    src.connect(nf);
    nf.connect(ng);
    ng.connect(out);
    src.start();
  }

  private playWhoosh(): void {
    const ctx = this.ctx!;
    const out = this.sfxGain!;
    this.duck(1200);
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(1.2);
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.6);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.15);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.1);
    src.connect(filter);
    filter.connect(g);
    g.connect(out);
    src.start();
  }

  private startBells(): void {
    if (this.bellsInterval != null) return;
    const ring = () => {
      if (!this.ctx || !this.sfxGain || this.muted) return;
      const ctx = this.ctx;
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = f;
        const g = ctx.createGain();
        const t = ctx.currentTime + i * 0.12;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.08, t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
        osc.connect(g);
        g.connect(this.sfxGain!);
        osc.start(t);
        osc.stop(t + 2);
      });
    };
    ring();
    this.bellsInterval = window.setInterval(ring, 4500);
  }

  private startTrain(): void {
    if (this.trainInterval != null) return;
    const clack = () => {
      if (!this.ctx || !this.sfxGain || this.muted) return;
      const ctx = this.ctx;
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer(0.06);
      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 800;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.15, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
      src.connect(filter);
      filter.connect(g);
      g.connect(this.sfxGain!);
      src.start();
    };
    clack();
    this.trainInterval = window.setInterval(clack, 280);
  }

  private playSplash(): void {
    const ctx = this.ctx!;
    const out = this.sfxGain!;
    this.duck(900);
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(0.5);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.4);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
    src.connect(filter);
    filter.connect(g);
    g.connect(out);
    src.start();
  }

  private playChime(): void {
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const notes = [659.25, 783.99, 987.77];
    const f = notes[Math.floor(Math.random() * notes.length)];
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start();
    osc.stop(ctx.currentTime + 1.3);
  }

  private startMusicBox(): void {
    if (this.musicboxNodes.length) return;
    if (!this.ctx || !this.sfxGain) return;
    const melody = [523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 392];
    let step = 0;
    const tick = () => {
      if (!this.ctx || !this.sfxGain || this.muted) return;
      const osc = this.ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = melody[step % melody.length];
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.06, this.ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.55);
      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.6);
      this.musicboxNodes.push(osc);
      step++;
    };
    tick();
    this.bellsInterval = window.setInterval(tick, 700);
  }

  dispose(): void {
    this.stopLoops();
    this.stopAmbient();
    try {
      this.musicSource?.stop();
    } catch {
      /* */
    }
    if (this.visibilityHandler) {
      document.removeEventListener("visibilitychange", this.visibilityHandler);
    }
    void this.ctx?.close();
    this.ctx = null;
    this.musicStarted = false;
  }
}

export const aniversarioAudio = new AniversarioAudio();
