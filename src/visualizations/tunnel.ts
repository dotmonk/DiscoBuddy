/** 8. Tunnel — zoom-through frequency tunnel */
import type { Visualizer } from '../visualizer.js';

export const tunnel: Visualizer = {
  name: 'Tunnel',

  init(_ctx, _w, _h) {},

  draw(ctx, w, h, audio, t) {
    ctx.fillStyle = 'rgba(10,10,15,0.25)';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2, cy = h / 2;
    const rings = 32;
    const speed = 0.6 + audio.bass * 2;

    for (let i = rings; i >= 1; i--) {
      const pct = i / rings;
      // rings zoom toward viewer over time
      const zPct = ((pct - (t * speed * 0.06) % 1) + 1) % 1;
      const r = zPct * Math.min(w, h) * 0.72;
      const freqIdx = Math.floor((1 - pct) * 80);
      const energy = audio.freq[freqIdx] / 255;
      const hue = (i * 11 + t * 40) % 360;
      const alpha = zPct * 0.7;

      // Distort ring by frequency
      ctx.beginPath();
      const segments = 64;
      for (let j = 0; j <= segments; j++) {
        const angle = (j / segments) * Math.PI * 2;
        const fIdx = Math.floor((j / segments) * 60);
        const fv = (audio.freq[fIdx] / 255) * 0.25;
        const rr = r * (1 + fv * energy);
        const x = cx + Math.cos(angle) * rr;
        const y = cy + Math.sin(angle) * rr * 0.55;
        j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `hsla(${hue},100%,65%,${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (audio.beat && i === rings) {
        ctx.fillStyle = `rgba(255,255,255,${audio.beatIntensity * 0.06})`;
        ctx.fill();
      }
    }
  },
};
