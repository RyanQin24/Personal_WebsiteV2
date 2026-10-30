"use client";

import { useId, useState } from "react";
import AnalogVuMeter from "./AnalogVuMeter";
import VfdSpectrum from "./VfdSpectrum";
import useWavAudio, { VU_CALIBRATION_DB } from "./useWavAudio";
import useDefaultMusic from "./useDefaultMusic";
import styles from "./DspLab.module.css";

const statusLabels = {
  empty: "Awaiting a WAV file",
  loading: "Decoding WAV…",
  ready: "Ready to play",
  playing: "Playing",
  paused: "Paused",
  ended: "Playback complete",
};

function clock(seconds: number) {
  const wholeSeconds = Math.max(0, Math.floor(seconds));
  return `${Math.floor(wholeSeconds / 60)}:${String(wholeSeconds % 60).padStart(2, "0")}`;
}

export default function DspLab() {
  const audio = useWavAudio();
  const library = useDefaultMusic();
  const [selectedTrack, setSelectedTrack] = useState("");
  const musicId = useId();
  const musicHelpId = useId();
  const fileId = useId();
  const volumeId = useId();
  const tauId = useId();
  const playing = audio.status === "playing";
  const busy = audio.status === "loading" || audio.starting;

  return (
    <section className={styles.lab} aria-labelledby="dsp-lab-title">
      <header className={styles.intro}>
        <p className={styles.eyebrow}>DSP! / THE LISTENING ROOM</p>
        <h1 id="dsp-lab-title">Sound, made visible.</h1>
        <p>Choose a track or load a WAV, then press play and watch the signal.</p>
      </header>

      <div className={styles.rack}>
        <div className={styles.rackHeading}>
          <div>
            <span className={styles.brand}>RQ / AUDIO LAB</span>
            <span className={styles.model}>STEREO MONITOR · 01</span>
          </div>
          <span className={styles.status} role="status">
            <span className={playing ? styles.liveLed : styles.idleLed} aria-hidden="true" />
            {statusLabels[audio.status]}
          </span>
        </div>

        <div className={styles.library}>
          <label className={styles.libraryLabel} htmlFor={musicId}>DEFAULT MUSIC</label>
          <div className={styles.libraryPicker}>
            <select
              id={musicId}
              className={styles.musicSelect}
              value={selectedTrack}
              aria-describedby={musicHelpId}
              disabled={library.tracks.length === 0}
              onChange={(event) => {
                const filename = event.target.value;
                const track = library.tracks.find((item) => item.filename === filename);
                if (track) {
                  setSelectedTrack(filename);
                  void audio.loadTrack(track);
                }
              }}
            >
              <option value="" disabled>
                {library.tracks.length > 0
                  ? "Choose a default track…"
                  : library.refreshing ? "Loading music…" : "No default music available"}
              </option>
              {selectedTrack && !library.tracks.some((track) => track.filename === selectedTrack) && (
                <option value={selectedTrack} disabled>
                  {selectedTrack.replace(/\.wav$/i, "")} (removed from library)
                </option>
              )}
              {library.tracks.map((track) => (
                <option key={track.filename} value={track.filename}>{track.title}</option>
              ))}
            </select>
            <button
              type="button"
              className={styles.refreshButton}
              disabled={library.refreshing}
              onClick={() => void library.refresh()}
            >
              {library.refreshing ? "Refreshing…" : "Refresh"}
            </button>
          </div>
          <p
            id={musicHelpId}
            className={library.error ? styles.libraryError : styles.libraryHelp}
            role={library.error ? "status" : undefined}
          >
            {library.error || "Pick a built-in track, or load your own WAV below."}
          </p>
        </div>

        <div className={styles.transport}>
          <div className={styles.track}>
            <label className={styles.fileButton} htmlFor={fileId}>
              <span aria-hidden="true">＋</span> My WAV
              <input
                id={fileId}
                type="file"
                accept=".wav,audio/wav,audio/x-wav,audio/wave"
                className={styles.fileInput}
                onChange={(event) => {
                  const selected = event.currentTarget.files?.[0];
                  event.currentTarget.value = "";
                  if (selected) {
                    setSelectedTrack("");
                    void audio.load(selected);
                  }
                }}
              />
            </label>
            <div className={styles.trackDetails}>
              <span className={styles.filename}>{audio.file?.name ?? "No track loaded"}</span>
              <span className={styles.fileMeta}>
                {audio.file
                  ? `${audio.file.channels === 1 ? "MONO → L + R" : "STEREO"} · ${Number((audio.file.sampleRate / 1000).toFixed(1))} kHz`
                  : "Mono or stereo · .wav"}
              </span>
            </div>
          </div>

          <div className={styles.playback}>
            <button
              type="button"
              className={styles.playButton}
              disabled={!audio.file || busy}
              onClick={() => playing ? audio.pause() : void audio.play()}
            >
              <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>
              {audio.starting ? "Starting…" : playing ? "Pause" : "Play"}
            </button>
            <button
              type="button"
              className={styles.stopButton}
              disabled={!audio.file || audio.status === "loading"}
              onClick={audio.stop}
            >
              <span aria-hidden="true">■</span> Stop
            </button>
            <span className={styles.clock} aria-label="Playback time">
              {clock(audio.frame.position)} <span>/ {clock(audio.file?.duration ?? 0)}</span>
            </span>
          </div>

          <progress
            className={styles.progress}
            value={audio.frame.position}
            max={audio.file?.duration || 1}
            aria-label="Playback progress"
          />
        </div>

        <div className={styles.meterBay}>
          <div className={styles.meter}>
            <AnalogVuMeter
              channel="L"
              levelDb={audio.frame.leftDb}
              measuredDb={audio.frame.rawLeftDb}
              calibrationDb={VU_CALIBRATION_DB}
              peak={audio.frame.leftPeak}
            />
          </div>
          <div className={styles.meter}>
            <AnalogVuMeter
              channel="R"
              levelDb={audio.frame.rightDb}
              measuredDb={audio.frame.rawRightDb}
              calibrationDb={VU_CALIBRATION_DB}
              peak={audio.frame.rightPeak}
            />
          </div>
        </div>

        <div className={styles.meterCaption}>
          <span>LEFT / RIGHT · RMS LEVEL</span>
          <span>0 VU = −18 dBFS</span>
        </div>

        <div className={styles.controls}>
          <div className={styles.control}>
            <div className={styles.controlHeading}>
              <label htmlFor={volumeId}>OUTPUT LEVEL</label>
              <output htmlFor={volumeId}>{audio.volume}%</output>
            </div>
            <input
              id={volumeId}
              type="range"
              min={0}
              max={100}
              value={audio.volume}
              aria-valuetext={`${audio.volume} percent`}
              onChange={(event) => audio.setVolume(Number(event.target.value))}
            />
            <p>Both displays follow the output level.</p>
          </div>

          <div className={styles.control}>
            <div className={styles.controlHeading}>
              <label htmlFor={tauId}>NEEDLE RESPONSE · τ</label>
              <output htmlFor={tauId}>{audio.tauMs} ms</output>
            </div>
            <input
              id={tauId}
              type="range"
              min={20}
              max={2000}
              step={10}
              value={audio.tauMs}
              aria-valuetext={`${audio.tauMs} milliseconds`}
              onChange={(event) => audio.setTauMs(Number(event.target.value))}
            />
            <p>63% of the way in one τ. Smaller is faster.</p>
          </div>
        </div>

        <div className={styles.spectrumBay}>
          <VfdSpectrum
            levelsDb={audio.frame.bands}
            maxHz={Math.min(20000, (audio.file?.sampleRate ?? 48000) / 2)}
            running={playing}
          />
        </div>

        {audio.error && <p className={styles.error} role="alert">{audio.error}</p>}
        <div className={styles.rackFooter}>
          <span>8192-POINT FFT · 48 LOG BANDS</span>
          <span>Your own WAV files stay in your browser.</span>
        </div>
      </div>

      <details className={styles.notes}>
        <summary>A note on the meters</summary>
        <p>
          The needles follow each channel&apos;s RMS amplitude with a first-order
          RC response: <code>y += (target − y) × (1 − e<sup>−Δt/τ</sup>)</code>.
          The same τ controls rise and fall, independently of the display frame rate.
          A steady −18 dBFS RMS signal reads 0 VU; the red end of the scale is +3 VU.
          The small red peak light indicates a signal reaching digital full scale.
        </p>
        <p>
          The spectrum combines left and right channel powers, so opposite-phase
          stereo signals remain visible. Frequency runs logarithmically from
          20 Hz to 20 kHz, capped at the audio context&apos;s Nyquist frequency.
          Each bar shows the strongest FFT bin in its band, with a −90 dBFS floor.
        </p>
      </details>
    </section>
  );
}
