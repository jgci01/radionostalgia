import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Heart, Music, Award } from 'lucide-react';

export default function QuienesSomos() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-zinc-100 flex flex-col items-center justify-between py-12 px-4 sm:px-6 md:py-16 md:px-8 overflow-x-hidden">
      
      {/* Decorative ambient background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-cyan-500/5 rounded-full blur-[100px] md:blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[350px] md:w-[650px] h-[350px] md:h-[650px] bg-indigo-500/5 rounded-full blur-[100px] md:blur-[150px]"></div>
      </div>

      <main className="w-full max-w-2xl flex flex-col space-y-10 relative z-10 my-auto">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs text-zinc-400 hover:text-zinc-100 bg-zinc-900/60 hover:bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700/80 px-4 py-2 rounded-full transition-all duration-300 shadow-md select-none group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-200 transition-colors group-hover:-translate-x-0.5 transform duration-255" />
            <span className="font-semibold tracking-wide">Volver al Dashboard</span>
          </Link>
        </div>

        {/* Brand Header */}
        <div className="space-y-3">
          <span className="text-[10px] tracking-[0.25em] text-cyan-400 uppercase font-bold block">Nuestra Historia</span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-100 bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Quiénes Somos
          </h1>
          <div className="h-0.5 w-16 bg-cyan-500/40 rounded-full"></div>
        </div>

        {/* Content Card */}
        <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 text-zinc-300 leading-relaxed text-sm md:text-base">
          <p>
            <strong className="text-zinc-100">RADIO NOSTALGIA DIGITAL</strong> es un espacio radiofónico en línea diseñado para reconectar con los grandes momentos de nuestras vidas a través del poder de la música. Transmitimos desde la hermosa ciudad de <span className="text-cyan-400 font-semibold">Mendoza, Argentina</span>, llevando el sonido dorado de las décadas pasadas al mundo entero.
          </p>

          <p>
            Nuestra propuesta rescata aquellas melodías imborrables que marcaron generaciones: baladas románticas, clásicos en español e inglés, jazz suave y ritmos melódicos que evocan recuerdos inolvidables y momentos llenos de nostalgia.
          </p>

          {/* Pillars List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/50">
            <div className="flex flex-col space-y-2 p-3.5 bg-zinc-950/40 border border-zinc-900 rounded-xl">
              <div className="p-1.5 bg-cyan-950/50 border border-cyan-500/10 rounded-lg w-fit text-cyan-400">
                <Music className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">Curación</h3>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Selección cuidadosa de joyas musicales que trascienden el tiempo.
              </p>
            </div>

            <div className="flex flex-col space-y-2 p-3.5 bg-zinc-950/40 border border-zinc-900 rounded-xl">
              <div className="p-1.5 bg-cyan-950/50 border border-cyan-500/10 rounded-lg w-fit text-cyan-400">
                <Heart className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">Pasión</h3>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Hecho por amantes del sonido vintage y la alta fidelidad.
              </p>
            </div>

            <div className="flex flex-col space-y-2 p-3.5 bg-zinc-950/40 border border-zinc-900 rounded-xl">
              <div className="p-1.5 bg-cyan-950/50 border border-cyan-500/10 rounded-lg w-fit text-cyan-400">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">Calidad</h3>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Streaming HD estable y un diseño pensado en la mejor experiencia.
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-400 italic pt-2">
            "Volver a escuchar es volver a vivir. Acompáñanos en este viaje al corazón de tus recuerdos."
          </p>

          {/* Locutor / Creador section */}
          <div className="pt-8 mt-2 border-t border-zinc-800/50 flex flex-col items-center">
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-6 text-center">Conoce a Nuestro Creador y Locutor</h3>
            <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden border border-zinc-700/50 group hover:border-cyan-500/40 transition-colors duration-500 shadow-xl shadow-cyan-950/10">
              <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
              <Image 
                src="/locutor.jpg" 
                alt="Creador y Locutor de Radio Nostalgia Digital" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 224px, 256px"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-2xl border-t border-zinc-900/60 mt-12 pt-6 text-center select-none z-10">
        <p className="text-[10px] text-zinc-500 tracking-widest uppercase font-medium">
          Radio Nostalgia Digital • Sintonía del recuerdo
        </p>
      </footer>
    </div>
  );
}
