/** 15. Starfield — hyperspace warp speed driven by audio intensity */
import type { Visualizer } from '../visualizer.js';

interface Star {
  x: number; y: number; z: number; pz: number;
}

const STAR_COUNT = 500;
const stars: Star[] = [];

function initStars(w: number, h: number): void {
  stars.length = 0;
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: (Math.random() - 0.5) * w * 2,
      y: (Math.random() - 0.5) * h * 2,
      z: Math.random() * w,
      pz: 0,
    });
    stars[stars.length - 1].pz = stars[stars.length - 1].z;
  }
}

export const starfield: Visualizer = {
  name: 'Starfield',

  init(_ctx, w, h) { initStars(w, h); },

  draw(ctx, w, h, audio, t) {
    ctx.fillStyle = 'rgba(10,10,15,0.3)';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2, cy = h / 2;
    const speed = 3 + audio.bass * 18 + audio.beatIntensity * 12;

    for (const s of stars) {
      s.pz = s.z;
      s.z -= speed;
      if (s.z <= 0) {
        s.x = (Math.random() - 0.5) * w * 2;
        s.y = (Math.random() - 0.5) * h * 2;
        s.z = w;
        s.pz = w;
      }

      const sx = (s.x / s.z) * w + cx;
      const sy = (s.y / s.z) * h + cy;
      const px = (s.x / s.pz) * w + cx;
      const py = (s.y / s.pz) * h + cy;
      const size = (1 - s.z / w) * 3;
      const brightness = 1 - s.z / w;
      const hue = (t * 40 + s.x * 0.1) % 360;

      ctx.strokeStyle = `hsla(${hue},80%,90%,${brightness * 0.9})`;
      ctx.lineWidth = size;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(sx, sy);
      ctx.stroke();
    }
  },
};
