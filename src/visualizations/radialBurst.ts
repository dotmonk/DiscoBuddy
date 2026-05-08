/** 2. Radial Burst — circular FFT with beat pulse */
import type { Visualizer } from '../visualizer.js';

export const radialBurst: Visualizer = {
  name: 'Radial Burst',

  init(_ctx, _w, _h) {},

  draw(ctx, w, h, audio, t) {
    ctx.fillStyle = 'rgba(10,10,15,0.25)';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2, cy = h / 2;
    const bars = 180;
    const step = Math.floor(audio.freq.length / bars);
    const baseR = Math.min(w, h) * 0.18 + audio.beatIntensity * 30;
    const maxR = Math.min(w, h) * 0.44;

    for (let i = 0; i < bars; i++) {
      let sum = 0;
      for (let j = 0; j < step; j++) sum += audio.freq[i * step + j];
      const v = sum / step / 255;
      const len = v * (maxR - baseR);
      const angle = (i / bars) * Math.PI * 2 - Math.PI / 2 + t * 0.1;
      const hue = (i / bars) * 360 + t * 20;

      const x1 = cx + Math.cos(angle) * baseR;
      const y1 = cy + Math.sin(angle) * baseR;
      const x2 = cx + Math.cos(angle) * (baseR + len);
      const y2 = cy + Math.sin(angle) * (baseR + len);

      ctx.strokeStyle = `hsla(${hue},100%,65%,0.85)`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Centre glow on beat
    if (audio.beatIntensity > 0.1) {
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 0.8);
      grad.addColorStop(0, `rgba(255,255,255,${audio.beatIntensity * 0.4})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  },
};
