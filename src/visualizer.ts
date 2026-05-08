import type { AudioData } from './audio.js';

export interface Visualizer {
  readonly name: string;
  /** Called once when this visualizer becomes active */
  init(ctx: CanvasRenderingContext2D, width: number, height: number): void;
  /** Called every frame */
  draw(ctx: CanvasRenderingContext2D, width: number, height: number, audio: AudioData, t: number): void;
  /** Called when this visualizer is being swapped out */
  destroy?(): void;
}
