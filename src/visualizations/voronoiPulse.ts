/** 19. Voronoi Pulse — Voronoi-like cells that flash on beats */
import type { Visualizer } from '../visualizer.js';

interface Site {
  x: number; y: number;
  vx: number; vy: number;
  hue: number;
}

const SITE_COUNT = 24;
const sites: Site[] = [];

function initSites(w: number, h: number): void {
  sites.length = 0;
  for (let i = 0; i < SITE_COUNT; i++) {
    sites.push({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      hue: Math.random() * 360,
    });
  }
}

export const voronoiPulse: Visualizer = {
  name: 'Voronoi Pulse',

  init(_ctx, w, h) { initSites(w, h); },

  draw(ctx, w, h, audio, _t) {
    // Move sites
    const speed = 1 + audio.bass * 4 + audio.beatIntensity * 3;
    for (const s of sites) {
      s.x += s.vx * speed;
      s.y += s.vy * speed;
      if (s.x < 0 || s.x > w) { s.vx *= -1; s.x = Math.max(0, Math.min(w, s.x)); }
      if (s.y < 0 || s.y > h) { s.vy *= -1; s.y = Math.max(0, Math.min(h, s.y)); }
    }

    // Rasterize: for each pixel-bucket find nearest site
    const STEP = 6;
    for (let py = 0; py < h; py += STEP) {
      for (let px = 0; px < w; px += STEP) {
        let minDist = Infinity, nearest = 0, secondDist = Infinity;
        for (let i = 0; i < sites.length; i++) {
          const dx = px - sites[i].x, dy = py - sites[i].y;
          const d = dx * dx + dy * dy;
          if (d < minDist) { secondDist = minDist; minDist = d; nearest = i; }
          else if (d < secondDist) { secondDist = d; }
        }
        const edgeProx = Math.sqrt(secondDist) - Math.sqrt(minDist);
        const isEdge = edgeProx < 6;
        const s = sites[nearest];
        const freqIdx = Math.floor((nearest / SITE_COUNT) * 100);
        const energy = audio.freq[freqIdx] / 255;
        const alpha = isEdge ? 0.8 : 0.08 + energy * 0.25 + audio.beatIntensity * 0.2;
        ctx.fillStyle = `hsla(${s.hue},80%,60%,${alpha})`;
        ctx.fillRect(px, py, STEP, STEP);
      }
    }
  },
};
