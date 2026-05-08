/** 6. Aurora — flowing aurora-borealis-like bands */
import type { Visualizer } from '../visualizer.js';

export const aurora: Visualizer = {
  name: 'Aurora',

  init(_ctx, _w, _h) {},

  draw(ctx, w, h, audio, t) {
    ctx.fillStyle = 'rgba(10,10,15,0.15)';
    ctx.fillRect(0, 0, w, h);

    const bands = 6;
    for (let b = 0; b < bands; b++) {
      const freqIdx = Math.floor((b / bands) * 80);
      const energy = (audio.freq[freqIdx] / 255);
      const hue = (b * 45 + t * 15 + audio.bass * 60) % 360;
      const yBase = h * (0.2 + b * 0.12);
      const amp = energy * h * 0.18 + audio.beatIntensity * h * 0.05;

      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const noise1 = Math.sin(x * 0.008 + t * (0.4 + b * 0.12)) * amp;
        const noise2 = Math.sin(x * 0.003 - t * (0.2 + b * 0.08)) * amp * 0.5;
        const y = yBase + noise1 + noise2;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, yBase - amp, 0, yBase + amp * 2);
      grad.addColorStop(0, `hsla(${hue},80%,65%,0)`);
      grad.addColorStop(0.4, `hsla(${hue},80%,65%,${0.08 + energy * 0.14})`);
      grad.addColorStop(1, `hsla(${hue},80%,65%,0)`);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  },
};
