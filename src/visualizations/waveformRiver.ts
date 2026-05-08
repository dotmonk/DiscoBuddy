/** 3. Waveform River — oscilloscope waveform with colour shifting */
import type { Visualizer } from '../visualizer.js';

export const waveformRiver: Visualizer = {
  name: 'Waveform River',

  init(_ctx, _w, _h) {},

  draw(ctx, w, h, audio, t) {
    ctx.fillStyle = 'rgba(10,10,15,0.18)';
    ctx.fillRect(0, 0, w, h);

    const layers = 3;
    for (let layer = 0; layer < layers; layer++) {
      const offset = (layer - 1) * h * 0.12;
      const hue = (t * 30 + layer * 120) % 360;
      const alpha = 0.6 - layer * 0.15;

      ctx.beginPath();
      ctx.lineWidth = 2 - layer * 0.4;
      ctx.strokeStyle = `hsla(${hue},90%,65%,${alpha})`;

      for (let i = 0; i < audio.wave.length; i++) {
        const x = (i / audio.wave.length) * w;
        const v = (audio.wave[i] - 128) / 128;
        const y = h / 2 + v * h * (0.38 + audio.bass * 0.15) + offset;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Beat flash
    if (audio.beat) {
      ctx.fillStyle = `rgba(255,255,255,${audio.beatIntensity * 0.12})`;
      ctx.fillRect(0, 0, w, h);
    }
  },
};
