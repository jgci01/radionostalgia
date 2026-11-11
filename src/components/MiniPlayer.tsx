'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Radio,
  Timer,
} from 'lucide-react';
import { useRadio } from '@/context/RadioContext';

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '00:00';
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function MiniPlayer() {
  const pathname = usePathname();
  const {
    mode,
    isPlaying,
    isLoading,
    currentProgram,
    volume,
    isMuted,
    currentTime,
    duration,
    sleepRemainingSeconds,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
    toggleMute,
  } = useRadio();

  // Show the bottom MiniPlayer when navigating outside the home dashboard (e.g. /programacion or /quienes-somos)
  if (pathname === '/') {
    return null;
  }

  const coverImage = mode === 'live' ? '/logo.png' : currentProgram.image;
  const title =
    mode === 'live' ? 'Señal en Vivo • Radio Nostalgia' : currentProgram.title;
  const subtitle =
    mode === 'live'
      ? 'Transmitiendo desde Mendoza, Argentina'
      : `${currentProgram.category} • ${currentProgram.subtitle}`;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-slate-950/90 backdrop-blur-xl border-t border-cyan-500/20 shadow-2xl shadow-black/80">
      {/* Interactive Progress Bar for Auto-DJ & On-Demand Programs */}
      {mode !== 'live' && duration > 0 && (
        <div className="w-full h-1 bg-zinc-900 relative group cursor-pointer">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={1}
            value={currentTime}
            onChange={(e) => seekTo( parseFloat(e.target.value) )}
            aria-label="Progreso del programa"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-150"
            style={{ width: `${Math.min(100, (currentTime / duration) * 100)}%` }}
          />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Spinning Vinyl Art & Track Info */}
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-cyan-500/40 shrink-0 shadow-md">
            <Image
              src={coverImage}
              alt={title}
              fill
              sizes="44px"
              unoptimized
              className={`object-cover ${isPlaying ? 'animate-spin-slow' : ''}`}
            />
            <div className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-slate-950 border border-zinc-700" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/20 shrink-0">
                {mode === 'live'
                  ? 'En Vivo'
                  : mode === 'autodj'
                  ? 'Auto-DJ 24/7'
                  : 'Programa'}
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-100 truncate">
                {title}
              </h4>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-zinc-400 truncate mt-0.5">
              <span className="truncate">{subtitle}</span>
              {mode !== 'live' && duration > 0 && (
                <span className="font-mono text-[10px] text-zinc-500 shrink-0">
                  • {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              )}
              {sleepRemainingSeconds !== null && (
                <span className="inline-flex items-center space-x-1 text-[10px] text-amber-400 font-mono shrink-0">
                  <Timer className="w-3 h-3" />
                  <span>{formatTime(sleepRemainingSeconds)}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          {mode !== 'live' && (
            <button
              type="button"
              onClick={prevTrack}
              className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
              title="Programa anterior"
            >
              <SkipBack className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 flex items-center justify-center shadow-lg shadow-cyan-500/25 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isLoading ? (
              <span className="w-4 h-4 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {mode !== 'live' && (
            <button
              type="button"
              onClick={nextTrack}
              className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
              title="Siguiente programa"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right: Volume & Back to Studio */}
        <div className="hidden sm:flex items-center space-x-3 shrink-0">
          <button
            type="button"
            onClick={toggleMute}
            className="text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            aria-label="Volumen"
            className="w-20 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />

          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 rounded-full transition-colors"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Estudio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
