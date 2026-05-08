/** 13. Mandala — symmetrical petal pattern drawn from live waveform */
import type { Visualizer } from '../visualizer.js';

export const mandala: Visualizer = {
  name: 'Mandala',

  init(_ctx, _w, _h) {},

  draw(ctx, w, h, audio, t) {
    ctx.fillStyle = 'rgba(10,10,15,0.18)';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2, cy = h / 2;
    const symmetry = 12;
    const slice = (Math.PI * 2) / symmetry;
    const maxR = Math.min(w, h) * 0.42;
    const waveLen = audio.wave.length;

    for (let s = 0; s < symmetry; s++) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(s * slice + t * 0.08);

      for (let mirror = 0; mirror < 2; mirror++) {
        ctx.save();
        if (mirror === 1) ctx.scale(1, -1);

        ctx.beginPath();
        for (let i = 0; i < Math.floor(waveLen / 4); i++) {
          const prog = i / (waveLen / 4);
          const r = prog * maxR * (1 + audio.beatIntensity * 0.12);
          const v = (audio.wave[i * 4] - 128) / 128;
          const angle = v * 0.5 + audio.bass * 0.3;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r + v * 20;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }

        const hue = (s * (360 / symmetry) + t * 20) % 360;
        ctx.strokeStyle = `hsla(${hue},90%,68%,0.5)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    }
  },
};
