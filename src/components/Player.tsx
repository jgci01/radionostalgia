'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import Image from 'next/image';
import {
  Radio,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Timer,
  Share2,
  Check,
  Disc3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useRadio } from '@/context/RadioContext';

declare global {
  interface Window {
    casterfmWidgetsRescan?: () => void;
  }
}

function formatSeconds(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '00:00';
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

const EQUALIZER_BARS = [
  'h-3 animate-[pulse_0.7s_ease-in-out_infinite]',
  'h-5 animate-[pulse_0.5s_ease-in-out_infinite_0.1s]',
  'h-7 animate-[pulse_0.8s_ease-in-out_infinite_0.2s]',
  'h-4 animate-[pulse_0.6s_ease-in-out_infinite_0.15s]',
  'h-8 animate-[pulse_0.9s_ease-in-out_infinite_0.05s]',
  'h-6 animate-[pulse_0.55s_ease-in-out_infinite_0.25s]',
  'h-3 animate-[pulse_0.75s_ease-in-out_infinite_0.3s]',
  'h-7 animate-[pulse_0.65s_ease-in-out_infinite_0.12s]',
  'h-5 animate-[pulse_0.85s_ease-in-out_infinite_0.22s]',
  'h-8 animate-[pulse_0.5s_ease-in-out_infinite_0.18s]',
  'h-4 animate-[pulse_0.7s_ease-in-out_infinite_0.08s]',
  'h-6 animate-[pulse_0.6s_ease-in-out_infinite_0.28s]',
];

export default function Player() {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSleepMenu, setShowSleepMenu] = useState(false);
  const [showCasterWidget, setShowCasterWidget] = useState(true);

  const embedContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    mode,
    isPlaying,
    isLoading,
    autoplayBlocked,
    currentProgram,
    volume,
    isMuted,
    currentTime,
    duration,
    sleepMinutes,
    sleepRemainingSeconds,
    togglePlay,
    pauseAudio,
    playLive,
    playAutoDj,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
    toggleMute,
    setSleepTimer,
  } = useRadio();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Re-initialize Caster.fm widget on client-side route navigation & add allow="autoplay" to its iframe
  useEffect(() => {
    if (!mounted || !showCasterWidget) return;

    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && typeof window.casterfmWidgetsRescan === 'function') {
        window.casterfmWidgetsRescan();
      }
    }, 150);

    const container = embedContainerRef.current;
    if (!container) return () => clearTimeout(timer);

    const observer = new MutationObserver(() => {
      const iframe = container.querySelector('iframe');
      if (iframe && !iframe.getAttribute('allow')?.includes('autoplay')) {
        iframe.setAttribute('allow', 'autoplay; encrypted-media');
      }
    });

    observer.observe(container, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [mounted, showCasterWidget]);

  // Pause global HTML5 audio if user clicks inside the Caster.fm iframe to avoid double audio
  useEffect(() => {
    const handleWindowBlur = () => {
      if (
        document.activeElement?.tagName === 'IFRAME' &&
        embedContainerRef.current?.contains(document.activeElement)
      ) {
        pauseAudio();
      }
    };

    window.addEventListener('blur', handleWindowBlur);
    return () => window.removeEventListener('blur', handleWindowBlur);
  }, [pauseAudio]);

  const handleShare = async () => {
    const shareData = {
      title: 'Radio Nostalgia Digital',
      text: 'Escucha Radio Nostalgia Digital — La sintonía del recuerdo en vivo desde Mendoza, Argentina.',
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to clipboard copy if user cancels or share fails
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore clipboard errors
    }
  };

  if (!mounted) {
    return (
      <div className="w-full max-w-lg mx-auto bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[260px] shadow-2xl">
        <div className="w-10 h-10 rounded-full border border-cyan-500/30 border-t-cyan-500 animate-spin mb-4"></div>
        <p className="text-zinc-500 text-sm">Inicializando consola de radio...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-lg mx-auto bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 md:p-7 shadow-2xl transition-all duration-300 hover:border-cyan-500/20 hover:shadow-cyan-950/20 select-none overflow-hidden group">
      {/* Decorative inner gradient lights */}
      <div className="absolute -top-16 -left-16 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/15 transition-all duration-500"></div>
      <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-500"></div>

      <div className="flex flex-col space-y-5 relative z-10">
        {/* Player Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/50 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-950/40 border border-cyan-500/20 rounded-lg group-hover:scale-105 transition-transform duration-300">
              <Radio className={`w-5 h-5 text-cyan-400 ${isPlaying ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <span className="text-[10px] tracking-widest text-cyan-400 uppercase font-semibold">
                {mode === 'live' ? 'Señal en Vivo' : 'Emisión Continua 24/7'}
              </span>
              <h2 className="text-zinc-100 font-bold tracking-tight text-sm md:text-base">
                Radio Nostalgia Digital
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              title="Compartir emisora"
              className="p-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/20">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-400/90 tracking-widest">
                {isPlaying ? 'AL AIRE' : 'ONLINE'}
              </span>
            </div>
          </div>
        </div>

        {/* Mode Selector Tabs: Señal en Vivo vs Auto-DJ 24/7 */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-950/70 border border-zinc-800/80 rounded-xl">
          <button
            type="button"
            onClick={playLive}
            className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mode === 'live'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Señal En Vivo</span>
          </button>
          <button
            type="button"
            onClick={playAutoDj}
            className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mode !== 'live'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
            }`}
          >
            <Disc3 className="w-3.5 h-3.5" />
            <span>Auto-DJ 24/7</span>
          </button>
        </div>

        {/* Main Studio Console Card */}
        <div className="p-4 bg-zinc-950/75 border border-cyan-500/20 rounded-xl shadow-inner space-y-4">
          {/* Top Row: Program/Stream Info + Equalizer Visualizer */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-zinc-700/80 shrink-0">
                <Image
                  src={mode === 'live' ? '/logo.png' : currentProgram.image}
                  alt={mode === 'live' ? 'Señal en Vivo' : currentProgram.title}
                  fill
                  sizes="48px"
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                  {mode === 'live'
                    ? 'Transmisión Directa'
                    : mode === 'autodj'
                    ? `Auto-DJ • ${currentProgram.category}`
                    : `Programa • ${currentProgram.category}`}
                </span>
                <h3 className="text-sm font-bold text-zinc-100 truncate">
                  {mode === 'live' ? 'Estudio Central Mendoza' : currentProgram.title}
                </h3>
                <p className="text-[11px] text-zinc-400 truncate">
                  {autoplayBlocked
                    ? '🔊 Toca Play o cualquier parte para activar el sonido'
                    : mode === 'live'
                    ? 'Sintonía del recuerdo en alta fidelidad'
                    : currentProgram.subtitle}
                </p>
              </div>
            </div>

            {/* Animated 12-Bar Spectrum Visualizer */}
            <div
              className="hidden sm:flex items-end space-x-0.5 h-8 px-2 py-1 bg-zinc-900/90 border border-zinc-800/80 rounded-lg shrink-0"
              aria-hidden="true"
            >
              {EQUALIZER_BARS.map((barClass, idx) => (
                <span
                  key={idx}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isPlaying
                      ? `bg-gradient-to-t from-cyan-500 to-emerald-400 ${barClass}`
                      : 'h-1.5 bg-zinc-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Progress Bar (Visible in Auto-DJ / Program Mode) */}
          {mode !== 'live' && duration > 0 && (
            <div className="space-y-1">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={1}
                value={currentTime}
                onChange={(e) => seekTo(parseFloat(e.target.value))}
                aria-label="Posición de reproducción"
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>{formatSeconds(currentTime)}</span>
                <span>{formatSeconds(duration)}</span>
              </div>
            </div>
          )}

          {/* Controls Row: Play/Pause, Next/Prev, Volume, Sleep Timer */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center space-x-2">
              {mode !== 'live' && (
                <button
                  type="button"
                  onClick={prevTrack}
                  title="Programa anterior"
                  className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-cyan-400 border border-zinc-800 transition-colors cursor-pointer"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pausar radio' : 'Reproducir radio'}
                className="w-11 h-11 rounded-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 flex items-center justify-center shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                {isLoading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              {mode !== 'live' && (
                <button
                  type="button"
                  onClick={nextTrack}
                  title="Siguiente programa"
                  className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-cyan-400 border border-zinc-800 transition-colors cursor-pointer"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Volume & Sleep Timer */}
            <div className="flex items-center space-x-3">
              {/* Volume Control */}
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                  className="text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  aria-label="Volumen"
                  className="w-16 sm:w-20 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Sleep Timer Toggle */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSleepMenu((prev) => !prev)}
                  title="Temporizador de apagado automático"
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                    sleepMinutes
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Timer className="w-3.5 h-3.5" />
                  {sleepRemainingSeconds !== null && (
                    <span className="font-mono text-[10px]">
                      {formatSeconds(sleepRemainingSeconds)}
                    </span>
                  )}
                </button>

                {showSleepMenu && (
                  <div className="absolute right-0 bottom-full mb-2 w-40 bg-zinc-900 border border-zinc-700 rounded-xl p-1.5 shadow-2xl z-30">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2 py-1">
                      Apagado automático
                    </div>
                    {[
                      { label: 'Desactivado', value: null },
                      { label: 'En 15 minutos', value: 15 },
                      { label: 'En 30 minutos', value: 30 },
                      { label: 'En 60 minutos', value: 60 },
                    ].map((opt) => (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => {
                          setSleepTimer(opt.value);
                          setShowSleepMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          sleepMinutes === opt.value
                            ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                            : 'text-zinc-300 hover:bg-zinc-800'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Third-party Caster.fm Shoutcast Embed */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setShowCasterWidget((prev) => !prev)}
            className="w-full flex items-center justify-between text-[11px] text-zinc-400 hover:text-zinc-200 px-1 transition-colors cursor-pointer"
          >
            <span>Reproductor Oficial Shoutcast (Caster.fm)</span>
            {showCasterWidget ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showCasterWidget && (
            <div
              ref={embedContainerRef}
              className="w-full min-h-[90px] flex items-center justify-center py-2 bg-zinc-950/45 border border-zinc-800/60 rounded-xl relative"
            >
              <div
                className="cstrEmbed mx-auto"
                data-type="newStreamPlayer"
                data-publictoken="72cc92b4-85ec-4451-8720-83ed4f589072"
                data-theme="dark"
                data-color="06709F"
                data-channelid=""
                data-rendered="false"
              >
                <a href="https://www.caster.fm">Shoutcast Hosting</a>{' '}
                <a href="https://www.caster.fm">Stream Hosting</a>{' '}
                <a href="https://www.caster.fm">Radio Server Hosting</a>
              </div>
            </div>
          )}
        </div>

        {/* Alternative External Links */}
        <div className="pt-3 border-t border-zinc-800/50 flex flex-col items-center">
          <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold mb-3">
            Escúchanos también en:
          </span>
          <div className="flex flex-wrap items-center gap-3 w-full justify-center">
            <a
              href="https://nostalgiadigital.radio12345.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-zinc-800/50 hover:bg-cyan-950/40 border border-zinc-700/50 hover:border-cyan-500/30 rounded-lg text-xs font-medium text-zinc-300 hover:text-cyan-400 transition-all duration-300 shadow-sm"
            >
              Web Player
            </a>
            <a
              href="https://www.twitch.tv/nostalgiadigital"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-zinc-800/50 hover:bg-[#6441a5]/20 border border-zinc-700/50 hover:border-[#6441a5]/50 rounded-lg text-xs font-medium text-zinc-300 hover:text-[#a970ff] transition-all duration-300 shadow-sm flex items-center space-x-1.5"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
              </svg>
              <span>Twitch</span>
            </a>
          </div>
        </div>
      </div>

      {/* Script Ingestion with Safety Lifecycle Handler */}
      <Script
        src="https://cdn.cloud.caster.fm//widgets/embed.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== 'undefined' && typeof window.casterfmWidgetsRescan === 'function') {
            window.casterfmWidgetsRescan();
          }
        }}
        onError={(e) => {
          console.error('Caster.fm script failed to load:', e);
        }}
      />
    </div>
  );
}
