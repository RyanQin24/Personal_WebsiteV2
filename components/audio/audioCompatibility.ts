/** Request iOS's media channel rather than the ringer-controlled ambient channel.
 * https://bugs.webkit.org/show_bug.cgi?id=237322#c6
 */
export function claimPlaybackSession(): () => void {
  try {
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
    if (!session) return () => {};
    const previousType = session.type;
    session.type = "playback";
    let released = false;
    return () => {
      if (released) return;
      released = true;
      try {
        if (session.type === "playback") session.type = previousType;
      } catch {
        // AudioSession is optional; browsers without a writable session still work.
      }
    };
  } catch {
    return () => {};
  }
}

/** Preserve the WAV's sample rate without opening the device's live audio output. */
function wavSampleRate(bytes: ArrayBuffer): number {
  const view = new DataView(bytes);
  const littleEndian = view.getUint32(0, false) !== 0x52494658; // RIFX is big-endian.
  for (let offset = 12; offset + 8 <= view.byteLength;) {
    const size = view.getUint32(offset + 4, littleEndian);
    if (view.getUint32(offset, false) === 0x666d7420 && size >= 16 && offset + 24 <= view.byteLength) {
      return view.getUint32(offset + 12, littleEndian);
    }
    offset += 8 + size + (size % 2);
  }
  return 44100;
}

export function decodeWavAudio(bytes: ArrayBuffer): Promise<AudioBuffer> {
  const OfflineContext = window.OfflineAudioContext ||
    (window as Window & { webkitOfflineAudioContext?: typeof OfflineAudioContext }).webkitOfflineAudioContext;
  if (!OfflineContext) throw new Error("This browser does not support WAV decoding.");
  // Decoding may follow a download/file read. An offline context needs no tap to run.
  const decoder = new OfflineContext(2, 1, wavSampleRate(bytes));
  return decoder.decodeAudioData(bytes);
}

export function resumeForPlayback(context: AudioContext, timeoutMs = 4000): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error("Audio is paused by your device. Tap Play again to resume."));
    }, timeoutMs);
    const failed = (error: unknown) => {
      window.clearTimeout(timeout);
      reject(error);
    };
    try {
      // Called synchronously by Play, before any await, to preserve iOS activation.
      context.resume().then(() => {
        window.clearTimeout(timeout);
        if (context.state === "running") resolve();
        else reject(new Error("Audio is paused by your device. Tap Play again to resume."));
      }, failed);
    } catch (error) {
      failed(error);
    }
  });
}
