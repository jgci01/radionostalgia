'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Play,
  Pause,
  Clock as ClockIcon,
  Sparkles,
  Disc3,
  Radio,
} from 'lucide-react';
import { PROGRAMS } from '@/data/programs';
import { useRadio } from '@/context/RadioContext';

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '00:00';
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function Programacion() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const {
    mode,
    isPlaying,
    isLoading,
    currentProgram,
    currentTime,
    duration,
    playProgram,
    playLive,
    seekTo,
  } = useRadio();

  const categories = ['Todos', ...Array.from(new Set(PROGRAMS.map((p) => p.category)))];

  const displayedPrograms =
    selectedCategory === 'Todos'
      ? PROGRAMS
      : PROGRAMS.filter((p) => p.category === selectedCategory);

  return (
    <div className="relative min-h-screen bg-slate-950 text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-zinc-100 flex flex-col items-center py-10 px-4 sm:px-6 md:py-14 md:px-8 pb-28 overflow-x-hidden">
      {/* Decorative ambient background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[800px] pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-cyan-500/5 rounded-full blur-[100px] md:blur-[150px]"></div>
        <div className="absolute top-[40%] right-[5%] w-[350px] md:w-[650px] h-[350px] md:h-[650px] bg-indigo-500/5 rounded-full blur-[100px] md:blur-[150px]"></div>
      </div>

      <main className="w-full max-w-5xl flex flex-col space-y-8 relative z-10">
        {/* Brand Header & Live Switch Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-[10px] tracking-[0.25em] text-cyan-400 uppercase font-bold block">
              Nuestra Parrilla y Fonoteca
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-100 bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Programación Exclusiva
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Escucha cualquiera de nuestros programas especiales bajo demanda con alta fidelidad. El reproductor continuará sonando aunque navegues por otras secciones.
            </p>
            <div className="h-0.5 w-16 bg-cyan-500/40 rounded-full mx-auto md:mx-0 mt-2"></div>
          </div>

          <button
            type="button"
            onClick={playLive}
            className={`self-center md:self-auto inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer shrink-0 ${
              mode === 'live' && isPlaying
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-950/30'
                : 'bg-zinc-900/80 border-zinc-800 hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-300'
            }`}
          >
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>
              {mode === 'live' && isPlaying
                ? 'Escuchando Señal en Vivo'
                : 'Volver a Señal en Vivo'}
            </span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-sm'
                  : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of Programs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 pt-2">
          {displayedPrograms.map((program) => {
            const isThisProgramActive =
              mode !== 'live' && currentProgram.id === program.id;
            const isThisProgramPlaying = isThisProgramActive && isPlaying;

            return (
              <div
                key={program.id}
                className={`bg-zinc-900/40 backdrop-blur-md border rounded-2xl overflow-hidden shadow-2xl flex flex-col group transition-all duration-500 ${
                  isThisProgramPlaying
                    ? 'border-cyan-500/60 shadow-cyan-950/30 ring-1 ring-cyan-500/20'
                    : 'border-zinc-800/80 hover:border-cyan-500/30'
                }`}
              >
                {/* Cover Image Section */}
                <div className="relative w-full h-52 overflow-hidden bg-zinc-950">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className={`object-cover transition-transform duration-700 ${
                      isThisProgramPlaying ? 'scale-105' : 'group-hover:scale-105'
                    }`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                  {/* Category Badge Top Left */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md border border-zinc-700/70 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                    {program.category}
                  </div>

                  {/* Active Equalizer Badge Top Right */}
                  {isThisProgramPlaying && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-950/90 backdrop-blur-md border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider text-emerald-300 flex items-center space-x-1.5">
                      <Disc3 className="w-3 h-3 animate-spin" />
                      <span>Sonando</span>
                    </div>
                  )}

                  {/* Floating Play Button on Image */}
                  <button
                    type="button"
                    onClick={() => playProgram(program)}
                    aria-label={
                      isThisProgramPlaying
                        ? `Pausar ${program.title}`
                        : `Reproducir ${program.title}`
                    }
                    className={`absolute bottom-3 right-3 w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 cursor-pointer ${
                      isThisProgramPlaying
                        ? 'bg-emerald-400 text-zinc-950 scale-105'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950 group-hover:scale-105'
                    }`}
                  >
                    {isThisProgramActive && isLoading ? (
                      <span className="w-5 h-5 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
                    ) : isThisProgramPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </button>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1.5 text-[11px] text-zinc-400 font-medium">
                      <ClockIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{program.schedule}</span>
                    </div>

                    <h3 className="text-lg font-bold text-zinc-100 tracking-tight group-hover:text-cyan-300 transition-colors">
                      {program.title}
                    </h3>

                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                      {program.description}
                    </p>
                  </div>

                  {/* Interactive Custom Player Bar Inside Card */}
                  <div className="pt-3 border-t border-zinc-800/60">
                    {isThisProgramActive ? (
                      <div className="space-y-2">
                        <input
                          type="range"
                          min={0}
                          max={duration || 100}
                          step={1}
                          value={currentTime}
                          onChange={(e) => seekTo(parseFloat(e.target.value))}
                          aria-label={`Avance de ${program.title}`}
                          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                        />
                        <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400">
                          <span>{formatTime(currentTime)}</span>
                          <span className="uppercase font-sans font-bold tracking-wider">
                            {isThisProgramPlaying ? 'En reproducción' : 'En pausa'}
                          </span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => playProgram(program)}
                        className="w-full py-2 px-3 rounded-xl bg-zinc-950/70 hover:bg-cyan-950/40 border border-zinc-800 hover:border-cyan-500/30 text-xs font-semibold text-zinc-300 hover:text-cyan-300 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Escuchar Episodio Completo</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl border-t border-zinc-900/60 mt-16 pt-6 text-center select-none z-10">
        <p className="text-[10px] text-zinc-500 tracking-widest uppercase font-medium">
          Radio Nostalgia Digital •{' '}
          <a
            href="https://tepuyfactory.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors font-semibold"
          >
            TepuyFactory
          </a>{' '}
          • Sintonía del recuerdo
        </p>
      </footer>
    </div>
  );
}
