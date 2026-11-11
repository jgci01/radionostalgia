'use client';

import Image from 'next/image';
import { Disc3 } from 'lucide-react';
import Clock from './Clock';
import Weather from './Weather';
import { useRadio } from '@/context/RadioContext';

export default function Header() {
  const { isPlaying, mode, currentProgram, togglePlay } = useRadio();

  return (
    <div className="flex flex-col items-center text-center space-y-6 md:space-y-7 select-none">
      {/* Brand Logo & Vinyl Platter Container */}
      <div className="relative group">
        {/* Soft glowing cyan/emerald light behind logo */}
        <div
          className={`absolute -inset-4 rounded-full blur-2xl transition-all duration-700 ${
            isPlaying
              ? 'bg-gradient-to-tr from-cyan-500/25 via-emerald-500/15 to-indigo-500/25 scale-105 opacity-100'
              : 'bg-cyan-500/10 scale-90 opacity-75 group-hover:bg-cyan-500/15'
          }`}
        />

        {/* Vinyl Outer Ring */}
        <button
          type="button"
          onClick={togglePlay}
          title={isPlaying ? 'Pausar reproducción' : 'Iniciar reproducción'}
          className={`relative p-3 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 border rounded-full shadow-2xl backdrop-blur-sm transition-all duration-500 cursor-pointer ${
            isPlaying
              ? 'border-cyan-500/40 shadow-cyan-950/40'
              : 'border-zinc-800/80 group-hover:border-cyan-500/30'
          }`}
        >
          {/* Decorative vinyl groove rings */}
          <div className="relative rounded-full p-2 bg-zinc-950 border border-zinc-800/70 shadow-inner">
            <div className="relative w-[176px] h-[176px] md:w-[196px] md:h-[196px] rounded-full overflow-hidden border border-zinc-800">
              <Image
                src="/logo.png"
                alt="Radio Nostalgia Digital Logo"
                width={200}
                height={200}
                priority
                className={`w-full h-full rounded-full object-cover transition-transform duration-700 ${
                  isPlaying ? 'animate-spin-slow' : 'group-hover:scale-105'
                }`}
              />
              {/* Subtle vinyl spindle center hole */}
              <div className="absolute inset-0 m-auto w-5 h-5 rounded-full bg-zinc-950/85 border-2 border-cyan-500/40 shadow-inner pointer-events-none" />
            </div>
          </div>

          {/* Floating Status Pill on Bottom of Vinyl */}
          <div
            className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-lg flex items-center space-x-1.5 whitespace-nowrap transition-all ${
              isPlaying
                ? 'bg-zinc-950/95 border-emerald-500/40 text-emerald-400'
                : 'bg-zinc-900/95 border-zinc-700 text-zinc-400 group-hover:text-cyan-300'
            }`}
          >
            <Disc3 className={`w-3 h-3 ${isPlaying ? 'animate-spin text-emerald-400' : 'text-cyan-400'}`} />
            <span>{isPlaying ? 'Girando al Aire' : 'Toca para Sintonizar'}</span>
          </div>
        </button>
      </div>

      {/* Brand Title Block */}
      <div className="space-y-2.5 max-w-lg mx-auto pt-1">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-100 bg-gradient-to-r from-zinc-100 via-cyan-100 to-zinc-400 bg-clip-text text-transparent">
          Radio Nostalgia Digital
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 font-medium tracking-widest uppercase">
          La sintonía del recuerdo en la web
        </p>

        {/* Now Playing Banner */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-300/90">
          <span className="font-semibold uppercase tracking-wider text-cyan-400">
            {mode === 'live' ? 'Señal en Vivo:' : 'En Emisión:'}
          </span>
          <span className="text-zinc-200 font-medium truncate max-w-[220px] sm:max-w-xs">
            {mode === 'live'
              ? 'Transmisión Oficial desde Mendoza'
              : currentProgram.title}
          </span>
        </div>
      </div>

      {/* Widgets row (Clock & Weather) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-lg">
        <Clock />
        <Weather />
      </div>
    </div>
  );
}
