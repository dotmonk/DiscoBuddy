import { AudioEngine } from './audio.js';
import { Cycler } from './cycler.js';
import { spectrumBars } from './visualizations/spectrumBars.js';
import { radialBurst } from './visualizations/radialBurst.js';
import { waveformRiver } from './visualizations/waveformRiver.js';
import { particleStorm } from './visualizations/particleStorm.js';
import { lissajous } from './visualizations/lissajous.js';
import { aurora } from './visualizations/aurora.js';
import { galaxy } from './visualizations/galaxy.js';
import { tunnel } from './visualizations/tunnel.js';
import { mirrorMaze } from './visualizations/mirrorMaze.js';
import { firePlasma } from './visualizations/firePlasma.js';
import { dnaHelix } from './visualizations/dnaHelix.js';
import { ripplePool } from './visualizations/ripplePool.js';
import { mandala } from './visualizations/mandala.js';
import { neonGrid } from './visualizations/neonGrid.js';
import { starfield } from './visualizations/starfield.js';
import { coralReef } from './visualizations/coralReef.js';
import { neonRings } from './visualizations/neonRings.js';
import { liquidMetal } from './visualizations/liquidMetal.js';
import { voronoiPulse } from './visualizations/voronoiPulse.js';
import { vinylGroove } from './visualizations/vinylGroove.js';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const startBtn = document.getElementById('start-btn') as HTMLButtonElement;
const vizNameEl = document.getElementById('viz-name') as HTMLElement;
const progressFill = document.getElementById('progress-fill') as HTMLElement;

const audio = new AudioEngine();
const cycler = new Cycler([
  spectrumBars,
  radialBurst,
  waveformRiver,
  particleStorm,
  lissajous,
  aurora,
  galaxy,
  tunnel,
  mirrorMaze,
  firePlasma,
  dnaHelix,
  ripplePool,
  mandala,
  neonGrid,
  starfield,
  coralReef,
  neonRings,
  liquidMetal,
  voronoiPulse,
  vinylGroove,
]);

let running = false;
let startTime = 0;

function resize(): void {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.scale(dpr, dpr);
  if (running) cycler.resize(ctx, window.innerWidth, window.innerHeight);
}

function loop(): void {
  if (!running) return;
  requestAnimationFrame(loop);

  const w = window.innerWidth;
  const h = window.innerHeight;
  const t = (performance.now() - startTime) / 1000;
  const audioData = audio.getData();

  ctx.save();
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  cycler.draw(ctx, w, h, audioData, t);
  ctx.restore();

  vizNameEl.textContent = cycler.currentName;
  progressFill.style.width = `${cycler.progress * 100}%`;
}

async function start(): Promise<void> {
  startBtn.disabled = true;
  startBtn.textContent = 'Connecting…';
  try {
    await audio.start();
  } catch (e) {
    startBtn.disabled = false;
    startBtn.textContent = 'Microphone denied — retry';
    console.error(e);
    return;
  }

  startBtn.style.display = 'none';
  running = true;
  startTime = performance.now();
  resize();
  cycler.init(ctx, window.innerWidth, window.innerHeight);
  loop();
}

window.addEventListener('resize', resize);
startBtn.addEventListener('click', () => { void start(); });
resize();
