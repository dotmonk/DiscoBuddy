/** 11. DNA Helix — double helix rotating and reacting to vocals/bass */
import type { Visualizer } from '../visualizer.js';

export const dnaHelix: Visualizer = {
  name: 'DNA Helix',

  init(_ctx, _w, _h) {},

  draw(ctx, w, h, audio, t) {
    ctx.fillStyle = 'rgba(10,10,15,0.22)';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const points = 120;
    const spread = h * 0.38;
    const twist = t * 1.8 + audio.bass * 4;

    for (let strand = 0; strand < 2; strand++) {
      const phaseOffset = strand * Math.PI;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const prog = i / points;
        const x = prog * w;
        const freqIdx = Math.floor(prog * 90);
        const energy = audio.freq[freqIdx] / 255;
        const amp = spread * (0.5 + energy * 0.6) * (1 + audio.beatIntensity * 0.2);
        const y = cx + Math.sin(prog * Math.PI * 5 + twist + phaseOffset) * amp * 0.45 +
                       Math.cos(prog * Math.PI * 3 + twist * 0.5) * amp * 0.12;
        const hue = (prog * 200 + t * 30 + strand * 160) % 360;
        ctx.strokeStyle = `hsla(${hue},90%,65%,0.8)`;
        if (i === 0) { ctx.moveTo(x, y); }
        else { ctx.lineTo(x, y); }
      }
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Rungs connecting the two strands
    for (let i = 0; i <= points; i += 4) {
      const prog = i / points;
      const x = prog * w;
      const freqIdx = Math.floor(prog * 90);
      const energy = audio.freq[freqIdx] / 255;
      const amp = spread * (0.5 + energy * 0.6);
      const y1 = cx + Math.sin(prog * Math.PI * 5 + twist) * amp * 0.45;
      const y2 = cx + Math.sin(prog * Math.PI * 5 + twist + Math.PI) * amp * 0.45;
      const hue = (prog * 200 + t * 30) % 360;
      ctx.strokeStyle = `hsla(${hue},80%,75%,0.35)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y1);
      ctx.lineTo(x, y2);
      ctx.stroke();
    }
  },
};
