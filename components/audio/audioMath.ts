const SPECTRUM_FLOOR_DB = -90;

/** Exact first-order RC step for a constant target over dt, independent of frame rate. */
export function rcStep(
  current: number,
  target: number,
  dtSeconds: number,
  tauSeconds: number,
): number {
  if (!(dtSeconds > 0)) return current;
  if (!(tauSeconds > 0)) return target;
  if (tauSeconds === Infinity) return current;

  const alpha = -Math.expm1(-dtSeconds / tauSeconds);
  return current + alpha * (target - current);
}

export function rmsAndPeak(samples: Float32Array): {
  rms: number;
  peak: number;
} {
  if (samples.length === 0) return { rms: 0, peak: 0 };

  let sumSquares = 0;
  let peak = 0;

  for (const sample of samples) {
    // Invalid samples cannot be represented by a meaningful meter reading.
    if (!Number.isFinite(sample)) continue;
    sumSquares += sample * sample;
    peak = Math.max(peak, Math.abs(sample));
  }

  return { rms: Math.sqrt(sumSquares / samples.length), peak };
}

export function amplitudeToDb(value: number, floorDb = -100): number {
  const floor = Number.isFinite(floorDb) ? floorDb : -100;
  if (!Number.isFinite(value) || value === 0) return floor;
  return Math.max(floor, 20 * Math.log10(Math.abs(value)));
}

/** Mean L/R power in dB; using relative powers also avoids numerical overflow. */
function stereoBinDb(leftDb: number, rightDb: number): number {
  const left = Number.isFinite(leftDb) ? leftDb : -Infinity;
  const right = Number.isFinite(rightDb) ? rightDb : -Infinity;
  const reference = Math.max(left, right);
  if (reference === -Infinity) return SPECTRUM_FLOOR_DB;

  const relativePower =
    (10 ** ((left - reference) / 10) +
      10 ** ((right - reference) / 10)) /
    2;

  return Math.max(
    SPECTRUM_FLOOR_DB,
    reference + 10 * Math.log10(relativePower),
  );
}

/**
 * Log-spaced spectrum bands in dB, taking each band's largest stereo mean power.
 * Combining powers preserves an anti-phase stereo signal instead of cancelling it.
 */
export function spectrumBands(
  leftDb: Float32Array,
  rightDb: Float32Array,
  sampleRate: number,
  fftSize: number,
  bandCount = 48,
  minHz = 20,
  maxHz = Math.min(20000, sampleRate / 2),
): number[] {
  const count = Number.isFinite(bandCount)
    ? Math.max(0, Math.floor(bandCount))
    : 0;
  const bands = Array<number>(count).fill(SPECTRUM_FLOOR_DB);
  const upperHz = Math.min(maxHz, sampleRate / 2);
  const binCount = Math.min(
    Math.floor(fftSize / 2),
    Math.max(leftDb.length, rightDb.length),
  );

  if (
    count === 0 ||
    binCount <= 0 ||
    !Number.isFinite(sampleRate) ||
    !(sampleRate > 0) ||
    !Number.isFinite(fftSize) ||
    !(fftSize >= 2) ||
    !Number.isFinite(minHz) ||
    !(minHz > 0) ||
    !Number.isFinite(upperHz) ||
    !(upperHz > minHz)
  ) {
    return bands;
  }

  const binHz = sampleRate / fftSize;
  const ratio = upperHz / minHz;
  const levelAt = (bin: number) =>
    stereoBinDb(leftDb[bin] ?? -Infinity, rightDb[bin] ?? -Infinity);

  for (let band = 0; band < count; band++) {
    const lowHz = minHz * ratio ** (band / count);
    const highHz = minHz * ratio ** ((band + 1) / count);
    const firstBin = Math.max(0, Math.ceil(lowHz / binHz));
    const lastBin = Math.min(binCount - 1, Math.ceil(highHz / binHz) - 1);

    if (firstBin > lastBin) {
      // Narrow bass bands can lie between FFT bins. Use their closest center bin.
      const centerBin = Math.max(
        0,
        Math.min(binCount - 1, Math.round(Math.sqrt(lowHz * highHz) / binHz)),
      );
      bands[band] = levelAt(centerBin);
      continue;
    }

    for (let bin = firstBin; bin <= lastBin; bin++) {
      bands[band] = Math.max(bands[band], levelAt(bin));
    }
  }

  return bands;
}
