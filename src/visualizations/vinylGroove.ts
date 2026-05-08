/** 20. Vinyl Groove — spinning vinyl record with spectrum arm */
import type { Visualizer } from '../visualizer.js';

let spinAngle = 0;

export const vinylGroove: Visualizer = {
  name: 'Vinyl Groove',

  init(_ctx, _w, _h) { spinAngle = 0; },

  draw(ctx, w, h, audio, t) {
    ctx.fillStyle = 'rgba(10,10,15,0.28)';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2, cy = h / 2;
    const maxR = Math.min(w, h) * 0.44;
    const rpm = 33.3 + audio.bass * 60;
    spinAngle += (rpm / 60) * (1 / 60) * Math.PI * 2;

    // --- Vinyl disc ---
    const disc = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
    disc.addColorStop(0, '#1a1a2e');
    disc.addColorStop(0.08, '#111122');
    disc.addColorStop(0.85, '#0d0d18');
    disc.addColorStop(1, '#222');
    ctx.beginPath();
    ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
    ctx.fillStyle = disc;
    ctx.fill();

    // Grooves
    const grooves = 30;
    for (let g = 3; g < grooves; g++) {
      const gr = (g / grooves) * maxR * 0.92;
      const freqIdx = Math.floor((g / grooves) * 100);
      const energy = audio.freq[freqIdx] / 255;
      ctx.beginPath();
      ctx.arc(cx, cy, gr, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,255,255,${0.03 + energy * 0.08})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Centre label
    const labelR = maxR * 0.18;
    const labelGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, labelR);
    labelGrad.addColorStop(0, `hsl(${t * 40 % 360},80%,50%)`);
    labelGrad.addColorStop(1, `hsl(${(t * 40 + 60) % 360},80%,30%)`);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(spinAngle);
    ctx.beginPath();
    ctx.arc(0, 0, labelR, 0, Math.PI * 2);
    ctx.fillStyle = labelGrad;
    ctx.fill();
    ctx.restore();

    // Spindle
    ctx.beginPath();
    ctx.arc(cx, cy, maxR * 0.025, 0, Math.PI * 2);
    ctx.fillStyle = '#888';
    ctx.fill();

    // --- Tone arm ---
    const armPivotX = cx + maxR * 1.1;
    const armPivotY = cy - maxR * 0.9;
    const armAngle = -Math.PI * 0.55 + audio.bass * 0.08;
    const armLen = maxR * 1.3;
    const tipX = armPivotX + Math.cos(armAngle) * armLen;
    const tipY = armPivotY + Math.sin(armAngle) * armLen;

    ctx.strokeStyle = 'rgba(200,200,200,0.7)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(armPivotX, armPivotY);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(armPivotX, armPivotY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#aaa';
    ctx.fill();

    // Spectrum around disc rim
    const bars = 120;
    for (let i = 0; i < bars; i++) {
      const angle = spinAngle + (i / bars) * Math.PI * 2;
      const freqIdx = Math.floor((i / bars) * 100);
      const energy = audio.freq[freqIdx] / 255;
      const r1 = maxR + 4;
      const r2 = r1 + energy * 35 * (1 + audio.beatIntensity * 0.5);
      const hue = (i / bars) * 360 + t * 20;
      ctx.strokeStyle = `hsla(${hue},100%,65%,0.8)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
      ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
      ctx.stroke();
    }
  },
};
