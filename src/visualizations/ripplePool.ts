/** 12. Ripple Pool — concentric shockwaves triggered on each beat */
import type { Visualizer } from '../visualizer.js';

interface Ripple {
  x: number; y: number;
  radius: number; maxRadius: number;
  hue: number; born: number;
}

const ripples: Ripple[] = [];

export const ripplePool: Visualizer = {
  name: 'Ripple Pool',

  init(_ctx, _w, _h) { ripples.length = 0; },

  draw(ctx, w, h, audio, t) {
    ctx.fillStyle = 'rgba(10,10,15,0.14)';
    ctx.fillRect(0, 0, w, h);

    if (audio.beat) {
      ripples.push({
        x: w * (0.2 + Math.random() * 0.6),
        y: h * (0.2 + Math.random() * 0.6),
        radius: 0,
        maxRadius: Math.min(w, h) * (0.3 + Math.random() * 0.4),
        hue: Math.random() * 360,
        born: t,
      });
    }

    // Ambient microripples from volume
    if (audio.volume > 0.05 && Math.random() < audio.mid * 0.4) {
      ripples.push({
        x: w * Math.random(), y: h * Math.random(),
        radius: 0,
        maxRadius: Math.min(w, h) * (0.05 + audio.volume * 0.15),
        hue: (t * 60) % 360,
        born: t,
      });
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      const speed = 1.5 + audio.bass * 4;
      r.radius += speed;
      const life = 1 - r.radius / r.maxRadius;
      if (life <= 0) { ripples.splice(i, 1); continue; }

      for (let ring = 0; ring < 3; ring++) {
        const rr = r.radius - ring * 12;
        if (rr < 0) continue;
        ctx.beginPath();
        ctx.arc(r.x, r.y, rr, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${r.hue + ring * 20},90%,65%,${life * (0.7 - ring * 0.2)})`;
        ctx.lineWidth = 2 - ring * 0.5;
        ctx.stroke();
      }
    }
  },
};
