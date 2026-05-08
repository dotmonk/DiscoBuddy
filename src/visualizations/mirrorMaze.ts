/** 9. Mirror Maze — mirrored waveform kaleidoscope */
import type { Visualizer } from '../visualizer.js';

export const mirrorMaze: Visualizer = {
  name: 'Mirror Maze',

  init(_ctx, _w, _h) {},

  draw(ctx, w, h, audio, t) {
    ctx.fillStyle = 'rgba(10,10,15,0.2)';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2, cy = h / 2;
    const slices = 8;
    const angleStep = (Math.PI * 2) / slices;

    for (let s = 0; s < slices; s++) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(s * angleStep + t * 0.05);
      if (s % 2 === 0) ctx.scale(1, -1);

      const hue = (s * 45 + t * 25) % 360;
      ctx.beginPath();
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = `hsla(${hue},90%,65%,0.7)`;

      const len = audio.wave.length;
      const halfLen = Math.floor(len / 2);
      for (let i = 0; i < halfLen; i++) {
        const x = (i / halfLen) * (w * 0.5);
        const v = (audio.wave[i] - 128) / 128;
        const y = v * h * (0.2 + audio.bass * 0.18);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // Beat ring
    if (audio.beatIntensity > 0.05) {
      ctx.beginPath();
      ctx.arc(cx, cy, audio.beatIntensity * Math.min(w, h) * 0.45, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,255,255,${audio.beatIntensity * 0.3})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  },
};
