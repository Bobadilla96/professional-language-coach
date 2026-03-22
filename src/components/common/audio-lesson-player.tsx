"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const SPEED_OPTIONS = [1, 1.25, 1.5, 1.75, 2, 2.5] as const;

interface AudioLessonPlayerProps {
  src: string;
  title: string;
  description?: string;
  compact?: boolean;
}

function formatTime(timeInSeconds: number) {
  if (!Number.isFinite(timeInSeconds) || timeInSeconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function AudioLessonPlayer({ src, title, description, compact = false }: AudioLessonPlayerProps) {
  return <AudioLessonPlayerInner key={src} src={src} title={title} description={description} compact={compact} />;
}

function AudioLessonPlayerInner({ src, title, description, compact = false }: AudioLessonPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const speed = SPEED_OPTIONS[speedIndex];
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const currentTimeLabel = useMemo(() => formatTime(currentTime), [currentTime]);
  const durationLabel = useMemo(() => formatTime(duration), [duration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setCurrentTime(audio.currentTime || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(audio.duration || 0);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
    };
  }, [src]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
  };

  const cycleSpeed = () => {
    setSpeedIndex((current) => (current + 1) % SPEED_OPTIONS.length);
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(value)) return;

    audio.currentTime = value;
    setCurrentTime(value);
  };

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      <div className={compact ? "space-y-2" : "space-y-3"}>
        <div className="flex items-center justify-between gap-3">
          <h3 className={compact ? "text-sm font-semibold" : "text-lg font-semibold"}>{title}</h3>
          <button
            type="button"
            onClick={cycleSpeed}
            className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
            aria-label={`Cambiar velocidad. Actual ${speed}x`}
          >
            {speed}x
          </button>
        </div>
        {description ? (
          <p className={compact ? "text-xs leading-5 text-slate-600 dark:text-slate-300" : "text-sm leading-6 text-slate-600 dark:text-slate-300"}>
            {description}
          </p>
        ) : null}
      </div>

      <audio ref={audioRef} preload="metadata">
        <source src={src} type="audio/mpeg" />
      </audio>

      <div className="rounded-[28px] bg-slate-100 px-3 py-3 dark:bg-slate-800/80">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlayback}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-slate-900 shadow-sm transition hover:bg-slate-50 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
            aria-label={isPlaying ? "Pausar audio" : "Reproducir audio"}
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center justify-between gap-3 text-xs font-medium text-slate-600 dark:text-slate-300">
              <span>{currentTimeLabel}</span>
              <span>{durationLabel}</span>
            </div>
            <div className="relative">
              <div className="h-1.5 rounded-full bg-slate-300 dark:bg-slate-700">
                <div
                  className="h-1.5 rounded-full bg-slate-900 transition-[width] dark:bg-slate-100"
                  style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={Math.min(currentTime, duration || 0)}
                onChange={(event) => handleSeek(Number(event.target.value))}
                className="absolute inset-0 h-1.5 w-full cursor-pointer opacity-0"
                aria-label="Desplazar audio"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
