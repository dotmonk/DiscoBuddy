/** 14. Neon Grid — 3D perspective grid that pulses to the beat */
import type { Visualizer } from '../visualizer.js';

export const neonGrid: Visualizer = {
  name: 'Neon Grid',

  init(_ctx, _w, _h) {},

  draw(ctx, w, h, audio, t) {
    ctx.fillStyle = `rgba(10,10,15,${audio.beat ? 0.4 : 0.3})`;
    ctx.fillRect(0, 0, w, h);

    const cols = 20, rows = 14;
    const horizon = h * 0.48 - audio.bass * 40;
    const fov = w * (0.9 + audio.beatIntensity * 0.15);
    const speed = t * 0.6;

    const hueBase = (t * 25) % 360;

    // Vertical lines
    for (let c = 0; c <= cols; c++) {
      const nx = (c / cols - 0.5);
      ctx.beginPath();
      for (let r = 0; r <= rows; r++) {
        const depth = (((r / rows) + speed) % 1);
        const z = depth === 0 ? 0.001 : depth;
        const px = w / 2 + (nx * fov) / z;
        const py = horizon + (h * 0.52) * (1 - 1 / (z * rows));
        r === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      const freqIdx = Math.floor((c / cols) * 50);
      const energy = audio.freq[freqIdx] / 255;
      const hue = (hueBase + c * 6) % 360;
      ctx.strokeStyle = `hsla(${hue},100%,${50 + energy * 40}%,${0.4 + energy * 0.5})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Horizontal lines
    for (let r = 0; r <= rows; r++) {
      const depth = (((r / rows) + speed) % 1);
      const z = depth === 0 ? 0.001 : depth;
      const py = horizon + (h * 0.52) * (1 - 1 / (z * rows));
      const left  = w / 2 + (-0.5 * fov) / z;
      const right = w / 2 + ( 0.5 * fov) / z;
      const freqIdx = Math.floor(depth * 80);
      const energy = audio.freq[freqIdx] / 255;
      const hue = (hueBase + r * 12) % 360;
      ctx.strokeStyle = `hsla(${hue},100%,${50 + energy * 40}%,${0.3 + energy * 0.4})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(left, py);
      ctx.lineTo(right, py);
      ctx.stroke();
    }
  },
};
