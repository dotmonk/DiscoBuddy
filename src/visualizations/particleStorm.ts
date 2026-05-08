/** 4. Particle Storm — particles driven by audio energy */
import type { Visualizer } from '../visualizer.js';
import type { AudioData } from '../audio.js';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  hue: number; size: number;
}

const particles: Particle[] = [];
const MAX_PARTICLES = 400;

function spawn(w: number, h: number, audio: AudioData): void {
  const count = Math.floor(audio.volume * 12) + (audio.beat ? 20 : 0);
  for (let i = 0; i < count && particles.length < MAX_PARTICLES; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + audio.bass * 6 + Math.random() * 3;
    particles.push({
      x: w / 2 + (Math.random() - 0.5) * w * 0.2,
      y: h / 2 + (Math.random() - 0.5) * h * 0.2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 0.6 + Math.random() * 0.8,
      hue: Math.random() * 360,
      size: 1.5 + Math.random() * 3 + audio.treble * 4,
    });
  }
}

export const particleStorm: Visualizer = {
  name: 'Particle Storm',

  init(_ctx, _w, _h) {
    particles.length = 0;
  },

  draw(ctx, w, h, audio, t) {
    ctx.fillStyle = 'rgba(10,10,15,0.22)';
    ctx.fillRect(0, 0, w, h);

    spawn(w, h, audio);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04; // gravity
      p.life -= 0.012;

      if (p.life <= 0 || p.x < -20 || p.x > w + 20 || p.y > h + 20) {
        particles.splice(i, 1);
        continue;
      }

      const alpha = p.life / p.maxLife;
      const hue = (p.hue + t * 40) % 360;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue},100%,70%,${alpha * 0.9})`;
      ctx.fill();
    }
  },
};
