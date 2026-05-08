/** 18. Liquid Metal — fluid metallic surface perturbed by audio */
import type { Visualizer } from '../visualizer.js';

export const liquidMetal: Visualizer = {
  name: 'Liquid Metal',

  init(_ctx, _w, _h) {},

  draw(ctx, w, h, audio, t) {
    ctx.fillStyle = 'rgba(10,10,15,0.25)';
    ctx.fillRect(0, 0, w, h);

    const rows = 28;
    const cols = 48;

    for (let row = 0; row < rows; row++) {
      const py = (row / rows) * h;
      ctx.beginPath();

      for (let col = 0; col <= cols; col++) {
        const px = (col / cols) * w;
        const nx = col / cols;
        const ny = row / rows;

        const freqIdx = Math.floor(nx * 100);
        const energy = audio.freq[freqIdx] / 255;

        const disp =
          Math.sin(nx * 8 + t * 1.1 + audio.bass * 3) * h * 0.02 * (1 + energy) +
          Math.cos(ny * 6 - t * 0.8 + audio.mid * 2) * h * 0.015 +
          Math.sin((nx + ny) * 5 + t * 0.5) * audio.beatIntensity * h * 0.04;

        const x = px + Math.sin(ny * 4 + t) * w * 0.01;
        const y = py + disp;
        col === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }

      const prog = row / rows;
      // Metallic gradient: silver-blue tones
      const lightness = 40 + Math.sin(prog * Math.PI + t * 0.5) * 25;
      const hue = (200 + t * 10 + audio.mid * 40) % 360;
      const alpha = 0.35 + (audio.freq[Math.floor(prog * 80)] / 255) * 0.5;
      ctx.strokeStyle = `hsla(${hue},30%,${lightness}%,${alpha})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    // Highlight sheen
    const sheen = ctx.createLinearGradient(0, 0, w, h);
    sheen.addColorStop(0, `rgba(255,255,255,${0.03 + audio.treble * 0.06})`);
    sheen.addColorStop(0.5, `rgba(255,255,255,${0.08 + audio.treble * 0.1})`);
    sheen.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, w, h);
  },
};
