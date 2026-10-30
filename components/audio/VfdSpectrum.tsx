"use client";

import { useEffect, useId, useRef } from "react";
import styles from "./VfdSpectrum.module.css";

type VfdSpectrumProps = {
  levelsDb: readonly number[];
  minHz?: number;
  maxHz?: number;
  running: boolean;
};

const FLOOR_DB = -90;
const SEGMENTS = 24;

function frequencyLabel(frequency: number) {
  return frequency >= 1000
    ? `${Number((frequency / 1000).toFixed(1))}k`
    : `${Math.round(frequency)}`;
}

function paintSpectrum(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  levelsDb: readonly number[],
  minHz: number,
  maxHz: number,
) {
  if (width < 1 || height < 1) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const ratio = window.devicePixelRatio || 1;
  const pixelWidth = Math.round(width * ratio);
  const pixelHeight = Math.round(height * ratio);
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, width, height);

  const left = width < 400 ? 36 : 43;
  const right = 16;
  const top = 24;
  const baseline = height - 48;
  const plotWidth = Math.max(1, width - left - right);
  const plotHeight = Math.max(1, baseline - top);
  const lowestFrequency = Math.max(1, minHz);
  const highestFrequency = Math.max(lowestFrequency * 1.01, maxHz);
  const frequencyToX = (frequency: number) =>
    left +
    (Math.log(frequency / lowestFrequency) /
      Math.log(highestFrequency / lowestFrequency)) *
      plotWidth;

  const background = context.createLinearGradient(0, 0, 0, height);
  background.addColorStop(0, "#071511");
  background.addColorStop(1, "#04100d");
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  context.font = `${width < 400 ? 10 : 11}px ui-monospace, Consolas, monospace`;
  context.textBaseline = "middle";
  context.fillStyle = "#79bba7";
  context.textAlign = "left";
  context.fillText("dBFS", 3, 10);

  for (const db of [0, -30, -60, FLOOR_DB]) {
    const y = baseline - ((db - FLOOR_DB) / -FLOOR_DB) * plotHeight;
    context.strokeStyle = "rgba(130, 223, 193, 0.11)";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(left, Math.round(y) + 0.5);
    context.lineTo(width - right, Math.round(y) + 0.5);
    context.stroke();
    context.textAlign = "right";
    context.fillStyle = "#79bba7";
    context.fillText(String(db), left - 8, y);
  }

  const candidates = Array.from(
    new Set([
      lowestFrequency,
      ...[20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000].filter(
        (frequency) => frequency > lowestFrequency && frequency < highestFrequency,
      ),
      highestFrequency,
    ]),
  ).sort((first, second) => first - second);
  const lastLabel = frequencyLabel(highestFrequency);
  const lastLabelStart = width - right - context.measureText(lastLabel).width;
  let previousLabelEnd = -Infinity;

  candidates.forEach((frequency, index) => {
    const x = frequencyToX(frequency);
    const label = frequencyLabel(frequency);
    const labelWidth = context.measureText(label).width;
    const isFirst = index === 0;
    const isLast = index === candidates.length - 1;
    const labelStart = isFirst ? x : isLast ? x - labelWidth : x - labelWidth / 2;
    const labelEnd = labelStart + labelWidth;
    if (!isFirst && !isLast && (labelStart < previousLabelEnd + 12 || labelEnd > lastLabelStart - 12)) {
      return;
    }

    context.strokeStyle = "rgba(130, 223, 193, 0.07)";
    context.beginPath();
    context.moveTo(Math.round(x) + 0.5, top);
    context.lineTo(Math.round(x) + 0.5, baseline);
    context.stroke();
    context.fillStyle = "#acf5dc";
    context.textAlign = isFirst ? "left" : isLast ? "right" : "center";
    context.fillText(label, x, baseline + 17);
    previousLabelEnd = labelEnd;
  });

  const barCount = levelsDb.length || 48;
  const barPitch = plotWidth / barCount;
  const barWidth = Math.max(1, barPitch * 0.64);
  const segmentPitch = plotHeight / SEGMENTS;
  const segmentHeight = Math.max(1, segmentPitch - 2);

  for (let bar = 0; bar < barCount; bar++) {
    const x = left + (bar + 0.5) * barPitch - barWidth / 2;
    const level = Number.isFinite(levelsDb[bar]) ? levelsDb[bar] : FLOOR_DB;
    const normalized = Math.max(0, Math.min(1, (level - FLOOR_DB) / -FLOOR_DB));
    const activeSegments = Math.round(normalized * SEGMENTS);

    if (activeSegments > 0) {
      context.fillStyle = "rgba(132, 255, 220, 0.17)";
      context.shadowColor = "#8affdb";
      context.shadowBlur = 9;
      context.fillRect(x, baseline - activeSegments * segmentPitch, barWidth, activeSegments * segmentPitch);
      context.shadowBlur = 0;
    }

    for (let segment = 0; segment < SEGMENTS; segment++) {
      const y = baseline - (segment + 1) * segmentPitch;
      context.fillStyle = segment < activeSegments
        ? segment >= activeSegments - 2 ? "#c3ffeb" : "#75e8c4"
        : "rgba(111, 203, 174, 0.075)";
      context.fillRect(x, y, barWidth, segmentHeight);
    }
  }

  context.shadowBlur = 0;
  context.textAlign = "right";
  context.fillStyle = "#79bba7";
  context.fillText("FREQUENCY / Hz", width - right, height - 9);
}

export default function VfdSpectrum({
  levelsDb,
  minHz = 20,
  maxHz = 20000,
  running,
}: VfdSpectrumProps) {
  const titleId = useId();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const dataRef = useRef({ levelsDb, minHz, maxHz });
  dataRef.current = { levelsDb, minHz, maxHz };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const redraw = () => {
      const bounds = canvas.getBoundingClientRect();
      sizeRef.current = { width: bounds.width, height: bounds.height };
      const current = dataRef.current;
      paintSpectrum(canvas, bounds.width, bounds.height, current.levelsDb, current.minHz, current.maxHz);
    };

    redraw();
    const observer = new ResizeObserver(redraw);
    observer.observe(canvas);
    window.addEventListener("resize", redraw);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", redraw);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height } = sizeRef.current;
    paintSpectrum(canvas, width, height, levelsDb, minHz, maxHz);
  }, [levelsDb, minHz, maxHz]);

  return (
    <figure className={styles.housing} aria-labelledby={titleId}>
      <figcaption className={styles.caption}>
        <span id={titleId}>FFT AUDIO SPECTRUM</span>
        <span className={styles.signal}>L + R POWER</span>
      </figcaption>
      <div className={styles.glass}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          role="img"
          aria-label={`Audio frequency spectrum from ${minHz} to ${Math.round(maxHz)} Hz on a logarithmic frequency axis. Level scale: minus 90 to 0 dBFS.`}
        >
          Audio frequency spectrum. The horizontal axis shows frequency in Hz;
          the vertical axis shows signal level from -90 to 0 dBFS.
        </canvas>
      </div>
      <div className={styles.footer}>
        <span className={running ? styles.running : styles.standby}>
          <span aria-hidden="true">●</span> {running ? "SIGNAL ACTIVE" : "STANDBY"}
        </span>
        <span>LOG FREQUENCY</span>
      </div>
    </figure>
  );
}
