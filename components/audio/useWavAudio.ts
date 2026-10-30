"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { amplitudeToDb, rcStep, rmsAndPeak, spectrumBands } from "./audioMath";

const FFT_SIZE = 8192;
const VU_WINDOW = 2048;
const BAND_COUNT = 48;
export const VU_CALIBRATION_DB = -18;
const MAX_METER_AMPLITUDE = 10 ** ((VU_CALIBRATION_DB + 3) / 20);

type PlaybackStatus = "empty" | "loading" | "ready" | "playing" | "paused" | "ended";
type AudioGraph = {
  context: AudioContext;
  output: GainNode;
  splitter: ChannelSplitterNode;
  vu: [AnalyserNode, AnalyserNode];
  fft: [AnalyserNode, AnalyserNode];
  samples: [Float32Array<ArrayBuffer>, Float32Array<ArrayBuffer>];
  frequencies: [Float32Array<ArrayBuffer>, Float32Array<ArrayBuffer>];
};
type Voice = { source: AudioBufferSourceNode; gate: GainNode };

export type WavInfo = {
  name: string;
  duration: number;
  sampleRate: number;
  channels: number;
};

function createGraph(volume: number): AudioGraph {
  const AudioContextConstructor =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextConstructor) {
    throw new Error("This browser does not support Web Audio. Try a current browser.");
  }

  const context = new AudioContextConstructor();
  const output = context.createGain();
  output.gain.value = volume;
  const splitter = context.createChannelSplitter(2);
  output.connect(context.destination);
  output.connect(splitter);

  function analyser(size: number) {
    const node = context.createAnalyser();
    node.fftSize = size;
    node.smoothingTimeConstant = 0;
    return node;
  }

  return {
    context,
    output,
    splitter,
    vu: [analyser(VU_WINDOW), analyser(VU_WINDOW)],
    fft: [analyser(FFT_SIZE), analyser(FFT_SIZE)],
    samples: [new Float32Array(VU_WINDOW), new Float32Array(VU_WINDOW)],
    frequencies: [new Float32Array(FFT_SIZE / 2), new Float32Array(FFT_SIZE / 2)],
  };
}

export default function useWavAudio() {
  const graphRef = useRef<AudioGraph | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const voiceRef = useRef<Voice | null>(null);
  const playingRef = useRef(false);
  const offsetRef = useRef(0);
  const startedAtRef = useRef(0);
  const loadVersionRef = useRef(0);
  const loadAbortRef = useRef<AbortController | null>(null);
  const playVersionRef = useRef(0);
  const disposedRef = useRef(false);
  const volumeRef = useRef(0.8);
  const tauRef = useRef(0.3);
  const smoothedRef = useRef({ rms: [0, 0], bands: Array<number>(BAND_COUNT).fill(-90) });
  const [status, setStatus] = useState<PlaybackStatus>("empty");
  const [starting, setStarting] = useState(false);
  const [file, setFile] = useState<WavInfo | null>(null);
  const [error, setError] = useState("");
  const [volume, setVolumeState] = useState(80);
  const [tauMs, setTauState] = useState(300);
  const [frame, setFrame] = useState({
    leftDb: -100,
    rightDb: -100,
    rawLeftDb: -100,
    rawRightDb: -100,
    leftPeak: false,
    rightPeak: false,
    bands: Array<number>(BAND_COUNT).fill(-90),
    position: 0,
  });

  const stopVoice = useCallback(() => {
    const voice = voiceRef.current;
    voiceRef.current = null;
    playingRef.current = false;
    if (!voice) return;

    const context = graphRef.current?.context;
    const now = context?.currentTime ?? 0;
    voice.source.onended = () => {
      voice.source.disconnect();
      voice.gate.disconnect();
    };
    voice.gate.gain.cancelScheduledValues(now);
    voice.gate.gain.setTargetAtTime(0, now, 0.004);
    try {
      voice.source.stop(now + 0.025);
    } catch {
      voice.source.disconnect();
      voice.gate.disconnect();
    }
  }, []);

  const stop = useCallback(() => {
    playVersionRef.current += 1;
    stopVoice();
    offsetRef.current = 0;
    setStarting(false);
    setFrame((previous) => ({ ...previous, position: 0 }));
    setStatus(bufferRef.current ? "ready" : "empty");
  }, [stopVoice]);

  const loadWav = useCallback(async (
    name: string,
    readBytes: (signal: AbortSignal) => Promise<ArrayBuffer>,
  ) => {
    if (disposedRef.current) return;
    const version = ++loadVersionRef.current;
    loadAbortRef.current?.abort();
    const controller = new AbortController();
    loadAbortRef.current = controller;
    const isCurrent = () =>
      !disposedRef.current &&
      version === loadVersionRef.current &&
      !controller.signal.aborted;

    stop();
    bufferRef.current = null;
    setFile(null);
    setError("");
    setStatus("loading");

    try {
      if (!/\.wav$/i.test(name)) {
        throw new Error("Choose a .wav file to load into the player.");
      }
      const bytes = await readBytes(controller.signal);
      if (!isCurrent()) return;
      const header = new TextDecoder("ascii").decode(bytes.slice(0, 12));
      if (!/^(RIFF|RIFX|RF64)/.test(header) || header.slice(8, 12) !== "WAVE") {
        throw new Error("This file is not a valid WAV file.");
      }

      const graph = graphRef.current ?? createGraph(volumeRef.current);
      graphRef.current = graph;
      let decoded: AudioBuffer;
      try {
        decoded = await graph.context.decodeAudioData(bytes);
      } catch {
        throw new Error("This WAV could not be decoded. Try a PCM or IEEE-float WAV file.");
      }
      if (!isCurrent()) return;
      if (decoded.numberOfChannels > 2) {
        throw new Error("Choose a mono or stereo WAV file for the two-channel player.");
      }
      if (!decoded.length || !Number.isFinite(decoded.duration) || decoded.duration <= 0) {
        throw new Error("This WAV does not contain any playable audio.");
      }

      graph.splitter.disconnect();
      for (let channel = 0; channel < 2; channel += 1) {
        const sourceChannel = decoded.numberOfChannels === 1 ? 0 : channel;
        graph.splitter.connect(graph.vu[channel], sourceChannel);
        graph.splitter.connect(graph.fft[channel], sourceChannel);
      }
      bufferRef.current = decoded;
      setFile({
        name,
        duration: decoded.duration,
        sampleRate: decoded.sampleRate,
        channels: decoded.numberOfChannels,
      });
      setStatus("ready");
    } catch (cause) {
      if (!isCurrent()) return;
      setError(cause instanceof Error ? cause.message : "The WAV file could not be loaded.");
      setStatus("empty");
    } finally {
      if (loadAbortRef.current === controller) loadAbortRef.current = null;
    }
  }, [stop]);

  const load = useCallback(
    (selected: File) => loadWav(selected.name, () => selected.arrayBuffer()),
    [loadWav],
  );

  const loadTrack = useCallback(
    (track: { filename: string; url: string }) => loadWav(track.filename, async (signal) => {
      const response = await fetch(track.url, { signal });
      if (response.status === 404) {
        throw new Error(
          `The website track "${track.filename}" is no longer available. Choose another track or load your own WAV.`,
        );
      }
      if (!response.ok) {
        throw new Error(
          `The website track "${track.filename}" could not be loaded (HTTP ${response.status}). Try again or load your own WAV.`,
        );
      }
      return response.arrayBuffer();
    }),
    [loadWav],
  );

  const play = useCallback(async () => {
    const graph = graphRef.current;
    const buffer = bufferRef.current;
    if (!graph || !buffer || playingRef.current) return;
    const version = ++playVersionRef.current;
    setStarting(true);
    setError("");

    try {
      await graph.context.resume();
      if (
        disposedRef.current || version !== playVersionRef.current ||
        buffer !== bufferRef.current
      ) return;

      if (offsetRef.current >= buffer.duration) offsetRef.current = 0;
      const source = graph.context.createBufferSource();
      source.buffer = buffer;
      const gate = graph.context.createGain();
      gate.gain.setValueAtTime(0, graph.context.currentTime);
      gate.gain.setTargetAtTime(1, graph.context.currentTime, 0.004);
      source.connect(gate);
      gate.connect(graph.output);
      const voice = { source, gate };
      voiceRef.current = voice;
      source.onended = () => {
        source.disconnect();
        gate.disconnect();
        if (disposedRef.current || voiceRef.current !== voice) return;
        voiceRef.current = null;
        playingRef.current = false;
        offsetRef.current = buffer.duration;
        setFrame((previous) => ({ ...previous, position: buffer.duration }));
        setStatus("ended");
      };
      startedAtRef.current = graph.context.currentTime;
      source.start(0, offsetRef.current);
      playingRef.current = true;
      setStatus("playing");
    } catch {
      if (disposedRef.current || version !== playVersionRef.current) return;
      stopVoice();
      setError("Playback could not start. Press Play to try again.");
      setStatus("paused");
    } finally {
      if (!disposedRef.current && version === playVersionRef.current) setStarting(false);
    }
  }, [stopVoice]);

  const pause = useCallback(() => {
    playVersionRef.current += 1;
    const graph = graphRef.current;
    if (graph && playingRef.current) {
      offsetRef.current = Math.min(
        bufferRef.current?.duration ?? 0,
        offsetRef.current + graph.context.currentTime - startedAtRef.current,
      );
    }
    stopVoice();
    setStarting(false);
    setStatus(bufferRef.current ? "paused" : "empty");
  }, [stopVoice]);

  function setVolume(value: number) {
    setVolumeState(value);
    volumeRef.current = value / 100;
    const graph = graphRef.current;
    graph?.output.gain.setTargetAtTime(value / 100, graph.context.currentTime, 0.015);
  }

  function setTauMs(value: number) {
    setTauState(value);
    tauRef.current = value / 1000;
  }

  useEffect(() => {
    disposedRef.current = false;
    let animationId = 0;
    let lastUpdate = 0;
    let atRest = true;

    function animate(timestamp: number) {
      animationId = requestAnimationFrame(animate);
      if (timestamp - lastUpdate < 1000 / 30) return;
      const dt = lastUpdate ? (timestamp - lastUpdate) / 1000 : 1 / 30;
      lastUpdate = timestamp;
      const graph = graphRef.current;
      if (!graph) return;
      const active = playingRef.current && graph.context.state === "running";
      const targetRms = [0, 0];
      const measuredRms = [0, 0];
      const peaks = [false, false];
      let targetBands = Array<number>(BAND_COUNT).fill(-90);

      if (active) {
        for (let channel = 0; channel < 2; channel += 1) {
          graph.vu[channel].getFloatTimeDomainData(graph.samples[channel]);
          const measured = rmsAndPeak(graph.samples[channel]);
          measuredRms[channel] = measured.rms;
          targetRms[channel] = Math.min(MAX_METER_AMPLITUDE, measured.rms);
          peaks[channel] = measured.peak >= 0.999;
          graph.fft[channel].getFloatFrequencyData(graph.frequencies[channel]);
        }
        targetBands = spectrumBands(
          graph.frequencies[0], graph.frequencies[1], graph.context.sampleRate,
          FFT_SIZE, BAND_COUNT,
        );
      }

      const smoothed = smoothedRef.current;
      for (let channel = 0; channel < 2; channel += 1) {
        smoothed.rms[channel] = rcStep(smoothed.rms[channel], targetRms[channel], dt, tauRef.current);
        if (smoothed.rms[channel] < 1e-7) smoothed.rms[channel] = 0;
      }
      smoothed.bands = smoothed.bands.map((value, index) => {
        const next = rcStep(value, targetBands[index], dt, targetBands[index] > value ? 0.035 : 0.15);
        return next < -89.95 ? -90 : next;
      });

      const quiet = !active && smoothed.rms.every((value) => value === 0) &&
        smoothed.bands.every((value) => value === -90);
      if (quiet && atRest) return;
      atRest = quiet;
      const duration = bufferRef.current?.duration ?? 0;
      const position = playingRef.current
        ? Math.min(duration, offsetRef.current + graph.context.currentTime - startedAtRef.current)
        : offsetRef.current;
      setFrame({
        leftDb: amplitudeToDb(smoothed.rms[0]),
        rightDb: amplitudeToDb(smoothed.rms[1]),
        rawLeftDb: amplitudeToDb(measuredRms[0]),
        rawRightDb: amplitudeToDb(measuredRms[1]),
        leftPeak: peaks[0],
        rightPeak: peaks[1],
        bands: [...smoothed.bands],
        position,
      });
    }

    animationId = requestAnimationFrame(animate);
    return () => {
      disposedRef.current = true;
      loadVersionRef.current += 1;
      playVersionRef.current += 1;
      loadAbortRef.current?.abort();
      loadAbortRef.current = null;
      cancelAnimationFrame(animationId);
      const voice = voiceRef.current;
      if (voice) {
        voice.source.onended = null;
        voice.source.stop();
        voice.source.disconnect();
        voice.gate.disconnect();
      }
      voiceRef.current = null;
      playingRef.current = false;
      const graph = graphRef.current;
      graphRef.current = null;
      if (graph) void graph.context.close().catch(() => {});
    };
  }, []);

  return {
    status, starting, file, error, volume, tauMs, frame,
    load, loadTrack, play, pause, stop, setVolume, setTauMs,
  };
}
