/**
 * AudioEngine — wraps Web Audio API, analyses microphone input.
 * Provides frequency/waveform data and beat detection.
 */
export interface AudioData {
  /** FFT frequency bins (0-255), length = fftSize/2 */
  freq: Uint8Array;
  /** Time-domain waveform (0-255), length = fftSize/2 */
  wave: Uint8Array;
  /** 0-1 overall volume (RMS) */
  volume: number;
  /** 0-1 sub-bass energy (20-60 Hz) */
  bass: number;
  /** 0-1 mid energy (300-2000 Hz) */
  mid: number;
  /** 0-1 high-frequency energy (4000-16000 Hz) */
  treble: number;
  /** true on the frame a beat is detected */
  beat: boolean;
  /** 0-1 smoothed beat intensity that decays */
  beatIntensity: number;
  /** sample rate of the audio context */
  sampleRate: number;
}

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private stream: MediaStream | null = null;

  private readonly FFT_SIZE = 2048;
  private freqData!: Uint8Array<ArrayBuffer>;
  private waveData!: Uint8Array<ArrayBuffer>;

  // Beat detection
  private beatBuffer: number[] = [];
  private readonly BEAT_HISTORY = 43; // ~1 s at 60fps / 1.4
  private beatIntensity = 0;
  private lastBeatTime = 0;

  get isRunning(): boolean {
    return this.ctx !== null && this.ctx.state === 'running';
  }

  async start(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });

    this.ctx = new AudioContext();
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = this.FFT_SIZE;
    this.analyser.smoothingTimeConstant = 0.82;

    const source = this.ctx.createMediaStreamSource(this.stream);
    source.connect(this.analyser);

    this.freqData = new Uint8Array(this.analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;
    this.waveData = new Uint8Array(this.analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;

    if (this.ctx.state === 'suspended') await this.ctx.resume();
  }

  stop(): void {
    this.stream?.getTracks().forEach(t => t.stop());
    this.ctx?.close();
    this.ctx = null;
    this.analyser = null;
    this.stream = null;
  }

  /** Call once per animation frame to get fresh audio data */
  getData(): AudioData {
    if (!this.analyser || !this.ctx) {
      const empty = new Uint8Array(this.FFT_SIZE / 2).fill(128);
      return {
        freq: empty, wave: empty,
        volume: 0, bass: 0, mid: 0, treble: 0,
        beat: false, beatIntensity: 0,
        sampleRate: 44100,
      };
    }

    this.analyser.getByteFrequencyData(this.freqData);
    this.analyser.getByteTimeDomainData(this.waveData);

    const binHz = (this.ctx.sampleRate / 2) / this.freqData.length;

    const volume = this.rms(this.waveData);
    const bass = this.bandAvg(this.freqData, 20, 140, binHz);
    const mid = this.bandAvg(this.freqData, 300, 2000, binHz);
    const treble = this.bandAvg(this.freqData, 4000, 16000, binHz);

    // Beat detection via sub-bass variance threshold
    this.beatBuffer.push(bass);
    if (this.beatBuffer.length > this.BEAT_HISTORY) this.beatBuffer.shift();
    const avgBass = this.beatBuffer.reduce((a, b) => a + b, 0) / this.beatBuffer.length;
    const now = performance.now();
    const beat = bass > avgBass * 1.4 && now - this.lastBeatTime > 250;
    if (beat) {
      this.lastBeatTime = now;
      this.beatIntensity = 1;
    }
    this.beatIntensity *= 0.88;

    return {
      freq: this.freqData,
      wave: this.waveData,
      volume,
      bass,
      mid,
      treble,
      beat,
      beatIntensity: this.beatIntensity,
      sampleRate: this.ctx.sampleRate,
    };
  }

  private rms(data: Uint8Array): number {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const v = (data[i] - 128) / 128;
      sum += v * v;
    }
    return Math.sqrt(sum / data.length);
  }

  private bandAvg(freq: Uint8Array, lo: number, hi: number, binHz: number): number {
    const start = Math.max(0, Math.floor(lo / binHz));
    const end = Math.min(freq.length - 1, Math.ceil(hi / binHz));
    if (end <= start) return 0;
    let sum = 0;
    for (let i = start; i <= end; i++) sum += freq[i];
    return (sum / ((end - start + 1) * 255));
  }
}
