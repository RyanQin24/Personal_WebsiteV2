"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type DefaultMusicTrack = {
  filename: string;
  title: string;
  url: string;
};

function isMusicTrack(value: unknown): value is DefaultMusicTrack {
  if (!value || typeof value !== "object") return false;
  const track = value as Partial<DefaultMusicTrack>;
  return typeof track.filename === "string" &&
    typeof track.title === "string" &&
    typeof track.url === "string" &&
    track.url === `/music/${encodeURIComponent(track.filename)}`;
}

export default function useDefaultMusic() {
  const [tracks, setTracks] = useState<DefaultMusicTrack[]>([]);
  const [refreshing, setRefreshing] = useState(true);
  const [error, setError] = useState("");
  const requestRef = useRef<AbortController | null>(null);
  const versionRef = useRef(0);

  const refresh = useCallback(async () => {
    const version = ++versionRef.current;
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setRefreshing(true);

    try {
      const response = await fetch("/api/music", {
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("The default music list could not be loaded. Try Refresh.");
      const payload: unknown = await response.json();
      const nextTracks = payload && typeof payload === "object" && "tracks" in payload
        ? payload.tracks
        : undefined;
      if (!Array.isArray(nextTracks) || !nextTracks.every(isMusicTrack)) {
        throw new Error("The default music list could not be loaded. Try Refresh.");
      }
      if (controller.signal.aborted || version !== versionRef.current) return;
      setTracks((previous) =>
        previous.length === nextTracks.length && previous.every((track, index) =>
          track.filename === nextTracks[index].filename &&
          track.title === nextTracks[index].title &&
          track.url === nextTracks[index].url,
        ) ? previous : nextTracks,
      );
      setError("");
    } catch (cause) {
      if (controller.signal.aborted || version !== versionRef.current) return;
      setError(cause instanceof Error ? cause.message : "The music list is unavailable. Try Refresh.");
    } finally {
      if (!controller.signal.aborted && version === versionRef.current) {
        requestRef.current = null;
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    void refresh();
    const refreshVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    const interval = window.setInterval(refreshVisible, 10000);
    window.addEventListener("focus", refreshVisible);
    document.addEventListener("visibilitychange", refreshVisible);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshVisible);
      document.removeEventListener("visibilitychange", refreshVisible);
      versionRef.current += 1;
      requestRef.current?.abort();
    };
  }, [refresh]);

  return { tracks, refreshing, error, refresh };
}
