'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { Radio } from 'lucide-react';

export default function Player() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full max-w-lg mx-auto bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[180px] shadow-2xl">
        <div className="w-10 h-10 rounded-full border border-cyan-500/30 border-t-cyan-500 animate-spin mb-4"></div>
        <p className="text-zinc-500 text-sm">Inicializando reproductor...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-lg mx-auto bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 md:p-8 shadow-2xl transition-all duration-300 hover:border-cyan-500/20 hover:shadow-cyan-950/20 select-none overflow-hidden group">
      {/* Decorative inner gradient lights */}
      <div className="absolute -top-16 -left-16 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/15 transition-all duration-500"></div>
      <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-all duration-500"></div>

      <div className="flex flex-col space-y-6 relative z-10">
        {/* Player Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/50 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-950/40 border border-cyan-500/20 rounded-lg group-hover:scale-105 transition-transform duration-300">
              <Radio className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <span className="text-[10px] tracking-widest text-cyan-400 uppercase font-semibold">Señal en Vivo</span>
              <h2 className="text-zinc-100 font-bold tracking-tight text-sm md:text-base">Radio Nostalgia Digital</h2>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] uppercase font-bold text-emerald-400/90 tracking-widest">ONLINE</span>
          </div>
        </div>

        {/* Third-party Caster.fm Shoutcast Embed */}
        <div className="w-full min-h-[90px] flex items-center justify-center py-2 bg-zinc-950/45 border border-zinc-800/60 rounded-xl relative">
          <div 
            className="cstrEmbed mx-auto" 
            data-type="newStreamPlayer" 
            data-publictoken="72cc92b4-85ec-4451-8720-83ed4f589072" 
            data-theme="dark" 
            data-color="06709F" 
            data-channelid="" 
            data-rendered="false"
          >
            <a href="https://www.caster.fm">Shoutcast Hosting</a> <a href="https://www.caster.fm">Stream Hosting</a> <a href="https://www.caster.fm">Radio Server Hosting</a>
          </div>
        </div>
        
        {/* Sub-label */}
        <p className="text-[10px] text-zinc-500 text-center tracking-wider italic">
          Si la reproducción no inicia automáticamente, por favor presione el botón Play.
        </p>
      </div>

      {/* Script Ingestion with Safety Lifecycle Handler */}
      <Script 
        src="https://cdn.cloud.caster.fm//widgets/embed.js" 
        strategy="afterInteractive" 
        onError={(e) => {
          console.error("Caster.fm script failed to load:", e);
        }}
      />
    </div>
  );
}
