/** 5. Lissajous — audio-driven Lissajous figures */
import type { Visualizer } from '../visualizer.js';

const TRAIL_LENGTH = 2048;
const trail: Float32Array = new Float32Array(TRAIL_LENGTH * 2);
let trailHead = 0;

export const lissajous: Visualizer = {
  name: 'Lissajous',

  init(_ctx, _w, _h) {
    trail.fill(0);
    trailHead = 0;
  },

  draw(ctx, w, h, audio, t) {
    ctx.fillStyle = 'rgba(10,10,15,0.12)';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2, cy = h / 2;
    const radius = Math.min(w, h) * 0.42;

    // Sample left vs right from waveform
    const half = audio.wave.length / 2;
    for (let i = 0; i < 8; i++) {
      const idx = Math.floor(Math.random() * half);
      const lv = (audio.wave[idx] - 128) / 128;
      const rv = (audio.wave[idx + Math.floor(half)] - 128) / 128;
      trail[trailHead * 2] = cx + lv * radius;
      trail[trailHead * 2 + 1] = cy + rv * radius;
      trailHead = (trailHead + 1) % TRAIL_LENGTH;
    }

    // Draw trail
    ctx.lineWidth = 1.5;
    for (let i = 0; i < TRAIL_LENGTH - 1; i++) {
      const age = i / TRAIL_LENGTH;
      const hue = (t * 50 + age * 180) % 360;
      const idx = (trailHead + i) % TRAIL_LENGTH;
      const nidx = (trailHead + i + 1) % TRAIL_LENGTH;
      ctx.strokeStyle = `hsla(${hue},100%,65%,${age * 0.8})`;
      ctx.beginPath();
      ctx.moveTo(trail[idx * 2], trail[idx * 2 + 1]);
      ctx.lineTo(trail[nidx * 2], trail[nidx * 2 + 1]);
      ctx.stroke();
    }
  },
};
