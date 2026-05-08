/** 17. Neon Rings — stacked torus-like rings distorted by frequency */
import type { Visualizer } from '../visualizer.js';

export const neonRings: Visualizer = {
  name: 'Neon Rings',

  init(_ctx, _w, _h) {},

  draw(ctx, w, h, audio, t) {
    ctx.fillStyle = 'rgba(10,10,15,0.2)';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2, cy = h / 2;
    const ringCount = 14;

    for (let r = 0; r < ringCount; r++) {
      const prog = r / ringCount;
      const baseRadius = prog * Math.min(w, h) * 0.48 + audio.beatIntensity * 20;
      const freqBand = Math.floor(prog * 100);
      const energy = audio.freq[freqBand] / 255;
      const hue = (r * 25 + t * 30) % 360;
      const segments = 120;
      const rotation = t * (r % 2 === 0 ? 0.2 : -0.15) * (1 + prog);

      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2 + rotation;
        const fIdx = Math.floor((i / segments) * 60) + freqBand;
        const fv = audio.freq[Math.min(fIdx, audio.freq.length - 1)] / 255;
        const rr = baseRadius * (1 + fv * 0.35 * energy);
        const x = cx + Math.cos(angle) * rr;
        const y = cy + Math.sin(angle) * rr * 0.55;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `hsla(${hue},100%,${55 + energy * 30}%,${0.3 + energy * 0.6})`;
      ctx.lineWidth = 1.5 + energy * 2;
      ctx.stroke();
    }
  },
};
