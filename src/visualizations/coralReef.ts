/** 16. Coral Reef — organic branching tendrils growing from sound */
import type { Visualizer } from '../visualizer.js';

function drawBranch(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  angle: number, len: number,
  depth: number, hue: number,
  audio: { freq: Uint8Array; beatIntensity: number; bass: number },
  t: number,
): void {
  if (depth <= 0 || len < 2) return;

  const freqIdx = Math.min(Math.floor(depth * 15), audio.freq.length - 1);
  const energy = audio.freq[freqIdx] / 255;
  const sway = Math.sin(t * 1.5 + depth * 0.7) * 0.3 * (1 + energy);
  const actualAngle = angle + sway;

  const x2 = x + Math.cos(actualAngle) * len;
  const y2 = y + Math.sin(actualAngle) * len;

  ctx.strokeStyle = `hsla(${hue + depth * 8},80%,${40 + energy * 40}%,${0.5 + energy * 0.4})`;
  ctx.lineWidth = Math.max(0.5, depth * 0.5);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  const spread = 0.4 + audio.bass * 0.5 + audio.beatIntensity * 0.3;
  drawBranch(ctx, x2, y2, actualAngle - spread, len * 0.7, depth - 1, hue, audio, t);
  drawBranch(ctx, x2, y2, actualAngle + spread, len * 0.7, depth - 1, hue + 20, audio, t);
  if (energy > 0.4) {
    drawBranch(ctx, x2, y2, actualAngle, len * 0.55, depth - 1, hue + 40, audio, t);
  }
}

export const coralReef: Visualizer = {
  name: 'Coral Reef',

  init(_ctx, _w, _h) {},

  draw(ctx, w, h, audio, t) {
    ctx.fillStyle = 'rgba(10,10,15,0.2)';
    ctx.fillRect(0, 0, w, h);

    const roots = 5;
    for (let i = 0; i < roots; i++) {
      const x = w * ((i + 0.5) / roots);
      const hue = (i * 72 + t * 15) % 360;
      const len = h * (0.06 + (audio.freq[i * 20] / 255) * 0.08);
      drawBranch(ctx, x, h, -Math.PI / 2, len, 7, hue, audio, t);
    }
  },
};
