/**
 * Shared audio engine for the aniversario journey.
 * Create on the "Abrir" tap (user gesture). Fail silent if music file missing.
 */

import { MUSIC } from "../data/trip";

type SfxKind =
  | "flap"
  | "engine"
  | "whoosh"
  | "bells"
  | "train"
  | "splash"
  | "chime"
  | "musicbox";

export class AniversarioAudio {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private songMix: GainNode | null = null;
  private tone: BiquadFilterNode | null = null;
  private room: ConvolverNode | null = null;
  private musicSource: AudioBufferSourceNode | null = null;
  private ambient: { source: AudioBufferSourceNode; gain: GainNode } | null = null;
  private ambientRequest = 0;
  private musicRequested = false;
  private available = new Set<string>();
  private tracks = new Map<string, Promise<AudioBuffer | null>>();
  private requestController: AbortController | null = null;
  private muted = false;
  private duckUntil = 0;
  private trainInterval: number | null = null;
  private musicboxNodes = new Set<OscillatorNode>();
  private bellsInterval: number | null = null;

  /** Runs directly in the Abrir click handler so Safari can resume the context. */
  unlock(available: string[]): void {
    if (this.ctx) return;
    try {
      const Audio = window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Audio) return;
      const ctx = new Audio();
      this.ctx = ctx;
      this.available = new Set(available);
      this.requestController = new AbortController();

      this.masterGain = ctx.createGain();
      this.masterGain.gain.value = Number(!this.muted);
      this.masterGain.connect(ctx.destination);

      this.musicGain = ctx.createGain();
      this.musicGain.gain.value = MUSIC.volume;
      this.musicGain.connect(this.masterGain);

      this.tone = ctx.createBiquadFilter();
      this.tone.type = "lowpass";
      this.tone.frequency.value = 20000;
      this.tone.Q.value = 0;
      this.tone.connect(this.musicGain);

      this.songMix = ctx.createGain();
      this.songMix.connect(this.tone);

      this.sfxGain = ctx.createGain();
      this.sfxGain.gain.value = 0.7;
      this.sfxGain.connect(this.masterGain);

      document.addEventListener("visibilitychange", this.syncVisibility);
      this.syncVisibility();
    } catch {
      this.dispose();
    }
  }

  private syncVisibility = () => {
    if (!this.ctx) return;
    const operation = document.hidden ? this.ctx.suspend() : this.ctx.resume();
    void operation.catch(() => {});
  };

  private load(url: string, ctx: AudioContext): Promise<AudioBuffer | null> {
    if (!this.available.has(url)) return Promise.resolve(null);
    const cached = this.tracks.get(url);
    if (cached) return cached;
    const request = fetch(url, { signal: this.requestController?.signal })
      .then(async (response) => response.ok ? ctx.decodeAudioData(await response.arrayBuffer()) : null)
      .catch(() => null);
    this.tracks.set(url, request);
    return request;
  }

  startMusic(): void {
    const ctx = this.ctx;
    const mix = this.songMix;
    if (!ctx || !mix || this.musicRequested) return;
    this.musicRequested = true;
    void this.load(MUSIC.aeropuerto, ctx).then((buffer) => {
      if (!buffer || this.ctx !== ctx || !this.musicRequested || this.musicSource) return;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(mix);
      source.start();
      this.musicSource = source;
    });
  }

  async playAmbient(url: string | undefined): Promise<void> {
    const ctx = this.ctx;
    const tone = this.tone;
    if (!ctx || !tone) return;
    if (!url) {
      this.stopAmbient();
      return;
    }
    const request = ++this.ambientRequest;
    const buffer = await this.load(url, ctx);
    if (this.ctx !== ctx || request !== this.ambientRequest) return;
    this.stopAmbient();
    if (!buffer) return;

    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gain);
    gain.connect(tone);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.setTargetAtTime(0.6, ctx.currentTime, 0.24);
    this.songMix?.gain.setTargetAtTime(0.55, ctx.currentTime, 0.24);
    source.start();
    this.ambient = { source, gain };
  }

  stopAmbient(): void {
    this.ambientRequest++;
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.ambient) {
      const { source, gain } = this.ambient;
      gain.gain.setTargetAtTime(0, now, 0.18);
      source.stop(now + 0.9);
      source.onended = () => gain.disconnect();
      this.ambient = null;
    }
    this.songMix?.gain.setTargetAtTime(1, now, 0.24);
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (!this.ctx || !this.masterGain) return;
    this.masterGain.gain.setTargetAtTime(muted ? 0 : 1, this.ctx.currentTime, 0.015);
    if (!muted) this.syncVisibility();
  }

  isMuted(): boolean {
    return this.muted;
  }

  setSunset(progress: number): void {
    if (!this.tone || !this.ctx) return;
    this.tone.frequency.setTargetAtTime(20000 * 0.08 ** progress, this.ctx.currentTime, 0.09);
  }

  private duck(durationMs: number): void {
    if (!this.musicGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.duckUntil = Math.max(this.duckUntil, now + durationMs / 1000);
    const gain = this.musicGain.gain;
    gain.cancelScheduledValues(now);
    gain.setTargetAtTime(MUSIC.duckedVolume, now, 0.08);
    gain.setTargetAtTime(MUSIC.volume, this.duckUntil, 0.3);
  }

  swell(): void {
    this.setMusicLevel(MUSIC.volume + 0.12);
  }

  private setMusicLevel(level: number): void {
    if (!this.musicGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.duckUntil = now;
    this.musicGain.gain.cancelScheduledValues(now);
    this.musicGain.gain.setTargetAtTime(level, now, 0.3);
  }

  play(kind: SfxKind): void {
    if (!this.ctx || !this.sfxGain || document.hidden) return;
    switch (kind) {
      case "flap":
        this.playFlap();
        break;
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
    this.musicboxNodes.clear();
  }

  private noiseBuffer(seconds: number): AudioBuffer {
    const ctx = this.ctx!;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  private playFlap(): void {
    const ctx = this.ctx!;
    const snap = ctx.createBufferSource();
    snap.buffer = this.noiseBuffer(0.05);
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1650;
    filter.Q.value = 0.84;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.16, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.044);
    snap.connect(filter).connect(gain).connect(this.sfxGain!);
    snap.start();
  }

  private getRoom(): ConvolverNode {
    if (this.room) return this.room;
    const ctx = this.ctx!;
    const room = ctx.createConvolver();
    const length = Math.round(ctx.sampleRate * 1.75);
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 4;
      }
    }
    room.buffer = impulse;
    const wet = ctx.createGain();
    wet.gain.value = 0.3;
    room.connect(wet).connect(this.sfxGain!);
    this.room = room;
    return room;
  }

  private strike(
    frequency: number,
    at: number,
    peak: number,
    decay: number,
    partials: number[],
    wet = false,
  ): OscillatorNode[] {
    const ctx = this.ctx!;
    return partials.map((ratio, index) => {
      const voice = ctx.createOscillator();
      const envelope = ctx.createGain();
      const tail = decay / (1 + index * 0.7);
      voice.frequency.value = frequency * ratio;
      envelope.gain.setValueAtTime(0.0001, at);
      envelope.gain.exponentialRampToValueAtTime(peak / (1 + index * 2), at + 0.018);
      envelope.gain.exponentialRampToValueAtTime(0.0001, at + tail);
      voice.connect(envelope).connect(this.sfxGain!);
      if (wet) envelope.connect(this.getRoom());
      voice.start(at);
      voice.stop(at + tail + 0.025);
      return voice;
    });
  }

  private playEngine(): void {
    const ctx = this.ctx!;
    const out = this.sfxGain!;
    this.duck(5900);

    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(55, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 4.6);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 3);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.4);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 5.9);

    osc.connect(filter);
    filter.connect(g);
    g.connect(out);
    osc.start();
    osc.stop(ctx.currentTime + 6);

    // Filtered noise whoosh layer
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(5.9);
    const nf = ctx.createBiquadFilter();
    nf.type = "bandpass";
    nf.frequency.value = 400;
    nf.Q.value = 0.6;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.0001, ctx.currentTime);
    ng.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.5);
    ng.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 5.9);
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
    if (this.bellsInterval !== null) return;
    const ring = () => {
      if (!this.ctx || document.hidden) return;
      const now = this.ctx.currentTime;
      [329.63, 392, 493.88].forEach((frequency, index) => {
        this.strike(frequency, now + index * 0.43, 0.065, 2.35, [1, 2.4, 3.7], true);
      });
    };
    ring();
    this.bellsInterval = window.setInterval(ring, 6200);
  }

  private startTrain(): void {
    if (this.trainInterval !== null) return;
    const texture = this.noiseBuffer(0.19);
    const clack = () => {
      if (!this.ctx || !this.sfxGain || document.hidden) return;
      const ctx = this.ctx;
      [0, 0.128].forEach((offset, index) => {
        const at = ctx.currentTime + offset;
        const source = ctx.createBufferSource();
        source.buffer = texture;
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = index ? 1100 : 510;
        filter.Q.value = 0.65;
        const g = ctx.createGain();
        g.gain.setValueAtTime(index ? 0.13 : 0.2, at);
        g.gain.exponentialRampToValueAtTime(0.0001, at + 0.15);
        source.connect(filter).connect(g).connect(this.sfxGain!);
        source.start(at);
      });
      this.strike(56, ctx.currentTime, 0.038, 0.26, [1, 2]);
    };
    clack();
    this.trainInterval = window.setInterval(clack, 465);
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
    g.connect(this.getRoom());
    src.start();
    [241, 382, 463].forEach((note, index) => {
      this.strike(note, ctx.currentTime + 0.045 + index * 0.052, 0.027, 0.14, [1, 1.7]);
    });
  }

  private playChime(): void {
    if (!this.ctx) return;
    const notes = [659.25, 783.99, 880, 987.77, 1046.5];
    const frequency = notes[Math.floor(Math.random() * notes.length)];
    this.strike(frequency, this.ctx.currentTime, 0.1, 1.3, [1, 2.01, 3.04], true);
  }

  private startMusicBox(): void {
    if (this.bellsInterval !== null) return;
    const melody = [261.63, 523.25, 659.25, 196, 587.33, 783.99, 220, 523.25, 698.46, 196, 493.88, 587.33];
    let step = 0;
    const tick = () => {
      if (!this.ctx || document.hidden) return;
      const accent = step % 3 === 0;
      const voices = this.strike(
        melody[step % melody.length], this.ctx.currentTime,
        accent ? 0.073 : 0.047, accent ? 0.62 : 0.46, [1, 2.015, 4.02], true,
      );
      for (const voice of voices) {
        this.musicboxNodes.add(voice);
        voice.onended = () => this.musicboxNodes.delete(voice);
      }
      step++;
    };
    tick();
    this.bellsInterval = window.setInterval(tick, 340);
  }

  reset(): void {
    this.stopLoops();
    this.stopAmbient();
    this.setSunset(0);
    this.setMusicLevel(MUSIC.volume);
    this.musicSource?.stop();
    this.musicSource = null;
    this.musicRequested = false;
  }

  dispose(): void {
    this.reset();
    this.requestController?.abort();
    this.requestController = null;
    this.tracks.clear();
    this.available.clear();
    document.removeEventListener("visibilitychange", this.syncVisibility);
    void this.ctx?.close().catch(() => {});
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.songMix = null;
    this.tone = null;
    this.room = null;
    this.sfxGain = null;
    this.muted = false;
  }
}
