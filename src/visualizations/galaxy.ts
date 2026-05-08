/** 7. Galaxy — rotating spiral of stars pulsing to music */
import type { Visualizer } from '../visualizer.js';

interface Star {
  angle: number; radius: number; speed: number;
  hue: number; size: number; arm: number;
}

const STAR_COUNT = 600;
const stars: Star[] = [];

function initStars(): void {
  stars.length = 0;
  const arms = 3;
  for (let i = 0; i < STAR_COUNT; i++) {
    const arm = i % arms;
    const t = Math.random();
    const r = 20 + t * 350;
    const spread = (1 - t) * 0.6 + 0.05;
    stars.push({
      arm,
      angle: (arm / arms) * Math.PI * 2 + t * Math.PI * 3 + (Math.random() - 0.5) * spread,
      radius: r,
      speed: 0.0003 + (1 / (r + 10)) * 0.04,
      hue: 180 + arm * 80 + Math.random() * 40,
      size: 0.5 + Math.random() * 2,
    });
  }
}

export const galaxy: Visualizer = {
  name: 'Galaxy',

  init(_ctx, _w, _h) { initStars(); },

  draw(ctx, w, h, audio, t) {
    ctx.fillStyle = 'rgba(10,10,15,0.18)';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2, cy = h / 2;
    const scale = (Math.min(w, h) / 800) + audio.beatIntensity * 0.08;

    for (const s of stars) {
      s.angle += s.speed * (1 + audio.bass * 3);
      const x = cx + Math.cos(s.angle) * s.radius * scale;
      const y = cy + Math.sin(s.angle) * s.radius * scale * 0.45;
      const hue = (s.hue + t * 20) % 360;
      const brightness = 0.5 + audio.treble * 0.5;
      const sz = s.size * (1 + audio.beatIntensity * 0.5);
      ctx.beginPath();
      ctx.arc(x, y, sz, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue},80%,${70 + brightness * 20}%,0.8)`;
      ctx.fill();
    }
  },
};
