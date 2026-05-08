import type { Visualizer } from './visualizer.js';
import type { AudioData } from './audio.js';

const CYCLE_MS = 10_000;
const FADE_MS = 1_200;

export class Cycler {
  private index = 0;
  private lastSwitch = 0;
  private fadingOut = false;
  private fadingIn = false;
  private nextIndex = 0;

  // Off-screen canvas for the outgoing viz during cross-fade
  private offCanvas: OffscreenCanvas | null = null;

  constructor(private vizList: Visualizer[]) {}

  /** Must be called after the canvas has a size */
  init(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    this.current.init(ctx, w, h);
    this.lastSwitch = performance.now();
    this.offCanvas = new OffscreenCanvas(w, h);
  }

  get current(): Visualizer {
    return this.vizList[this.index];
  }

  get currentName(): string {
    return this.current.name;
  }

  /** 0-1 progress within current cycle */
  get progress(): number {
    const elapsed = performance.now() - this.lastSwitch;
    return Math.min(elapsed / CYCLE_MS, 1);
  }

  draw(ctx: CanvasRenderingContext2D, w: number, h: number, audio: AudioData, t: number): void {
    const elapsed = performance.now() - this.lastSwitch;

    if (!this.fadingOut && elapsed >= CYCLE_MS - FADE_MS) {
      this.fadingOut = true;
      this.nextIndex = (this.index + 1) % this.vizList.length;
    }

    if (this.fadingOut) {
      const fadeProgress = (elapsed - (CYCLE_MS - FADE_MS)) / FADE_MS;

      if (fadeProgress >= 0.5 && !this.fadingIn) {
        // Halfway through: switch to next viz
        this.fadingIn = true;
        this.current.destroy?.();
        this.index = this.nextIndex;
        this.current.init(ctx, w, h);
      }

      if (fadeProgress >= 1) {
        // Cross-fade complete
        this.fadingOut = false;
        this.fadingIn = false;
        this.lastSwitch = performance.now();
      }

      if (!this.fadingIn) {
        // Fading out: draw outgoing at decreasing alpha
        const a = 1 - fadeProgress * 2;
        ctx.save();
        ctx.globalAlpha = Math.max(0, a);
        this.current.draw(ctx, w, h, audio, t);
        ctx.restore();
      } else {
        // Fading in: draw incoming at increasing alpha
        const a = (fadeProgress - 0.5) * 2;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, a));
        this.current.draw(ctx, w, h, audio, t);
        ctx.restore();
      }
    } else {
      this.current.draw(ctx, w, h, audio, t);
    }
  }

  resize(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    if (this.offCanvas) {
      this.offCanvas.width = w;
      this.offCanvas.height = h;
    }
    this.current.init(ctx, w, h);
  }
}
