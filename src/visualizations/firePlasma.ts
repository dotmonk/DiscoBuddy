/** 10. Fire Plasma — plasma/fire effect reacting to sound */
import type { Visualizer } from '../visualizer.js';

let imageData: ImageData | null = null;
const COLS = 160;
const ROWS = 90;
const buf = new Uint8ClampedArray(COLS * ROWS * 4);

export const firePlasma: Visualizer = {
  name: 'Fire Plasma',

  init(ctx, w, h) {
    imageData = ctx.createImageData(w, h);
  },

  draw(ctx, w, h, audio, t) {
    if (!imageData) { imageData = ctx.createImageData(w, h); }

    const bassEnergy = audio.bass;
    const midEnergy = audio.mid;

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const nx = col / COLS;
        const ny = row / ROWS;

        const v =
          Math.sin(nx * 10 + t * 1.2 + bassEnergy * 5) * 0.25 +
          Math.sin(ny * 8 - t * 0.9 + midEnergy * 4) * 0.25 +
          Math.sin((nx + ny) * 6 + t * 0.7) * 0.25 +
          Math.sin(Math.sqrt((nx - 0.5) ** 2 + (ny - 0.5) ** 2) * 12 - t * 2 + audio.beatIntensity * 3) * 0.25;

        // v in [-1,1] → [0,1]
        const norm = (v + 1) / 2;
        const idx = (row * COLS + col) * 4;

        // Fire palette: black → red → orange → yellow → white
        if (norm < 0.25) {
          buf[idx] = norm * 4 * 200; buf[idx + 1] = 0; buf[idx + 2] = 0;
        } else if (norm < 0.5) {
          buf[idx] = 200; buf[idx + 1] = (norm - 0.25) * 4 * 150; buf[idx + 2] = 0;
        } else if (norm < 0.75) {
          buf[idx] = 200 + (norm - 0.5) * 4 * 55;
          buf[idx + 1] = 150 + (norm - 0.5) * 4 * 100;
          buf[idx + 2] = 0;
        } else {
          const b = (norm - 0.75) * 4;
          buf[idx] = 255; buf[idx + 1] = 255; buf[idx + 2] = b * 255;
        }
        buf[idx + 3] = 255;
      }
    }

    // Scale up the low-res buffer to canvas size
    const tmp = new ImageData(buf.slice(0, COLS * ROWS * 4), COLS, ROWS);
    const offscreen = new OffscreenCanvas(COLS, ROWS);
    const offCtx = offscreen.getContext('2d')!;
    offCtx.putImageData(tmp, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';
    ctx.drawImage(offscreen, 0, 0, w, h);
  },
};
