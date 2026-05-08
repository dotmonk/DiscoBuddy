/** 1. Spectrum Bars — classic frequency bars with colour gradient */
import type { Visualizer } from '../visualizer.js';

export const spectrumBars: Visualizer = {
  name: 'Spectrum Bars',

  init(_ctx, _w, _h) {},

  draw(ctx, w, h, audio) {
    ctx.fillStyle = 'rgba(10,10,15,0.3)';
    ctx.fillRect(0, 0, w, h);

    const bars = 128;
    const step = Math.floor(audio.freq.length / bars);
    const bw = w / bars;
    const beatScale = 1 + audio.beatIntensity * 0.15;

    for (let i = 0; i < bars; i++) {
      let sum = 0;
      for (let j = 0; j < step; j++) sum += audio.freq[i * step + j];
      const v = (sum / step / 255) * beatScale;
      const barH = v * h * 0.85;
      const hue = (i / bars) * 260 + 180;
      const alpha = 0.7 + v * 0.3;

      const grad = ctx.createLinearGradient(0, h, 0, h - barH);
      grad.addColorStop(0, `hsla(${hue},100%,55%,${alpha})`);
      grad.addColorStop(1, `hsla(${hue + 40},100%,75%,${alpha})`);

      ctx.fillStyle = grad;
      ctx.fillRect(i * bw + 1, h - barH, bw - 2, barH);
    }
  },
};
