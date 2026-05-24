import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, PlayCircle } from 'lucide-react';

const PROGRAMS = [
  { id: 1, title: 'Cantares Latinoamericanos', image: '/images/cantares.jpeg', audio: '/audio/cantares.mpeg' },
  { id: 2, title: 'El Baúl de los recuerdos', image: '/images/baul.jpeg', audio: '/audio/baul.mpeg' },
  { id: 3, title: 'Nostalgia Instrumental', image: '/images/instrumental.jpeg', audio: '/audio/instrumental.mpeg' },
  { id: 4, title: 'Nostalgia Vallenata', image: '/images/vallenata.jpeg', audio: '/audio/vallenata.mpeg' },
  { id: 5, title: 'Joyas Musicales del ayer', image: '/images/joyas.jpeg', audio: '/audio/joyas.mpeg' },
  { id: 6, title: 'Bailables del recuerdo', image: '/images/bailables.jpeg', audio: '/audio/bailables.mpeg' },
  { id: 7, title: 'El Rincón de Juancho', image: '/images/juancho.jpeg', audio: '/audio/juancho.mpeg' },
];

export default function Programacion() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-zinc-100 flex flex-col items-center py-12 px-4 sm:px-6 md:py-16 md:px-8 overflow-x-hidden">
      
      {/* Decorative ambient background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[800px] pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-cyan-500/5 rounded-full blur-[100px] md:blur-[150px]"></div>
        <div className="absolute top-[40%] right-[5%] w-[350px] md:w-[650px] h-[350px] md:h-[650px] bg-indigo-500/5 rounded-full blur-[100px] md:blur-[150px]"></div>
      </div>

      <main className="w-full max-w-5xl flex flex-col space-y-10 relative z-10">
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
        <div className="space-y-3 text-center md:text-left">
          <span className="text-[10px] tracking-[0.25em] text-cyan-400 uppercase font-bold block">Nuestra Parrilla</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-100 bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Programación
          </h1>
          <div className="h-0.5 w-16 bg-cyan-500/40 rounded-full mx-auto md:mx-0 mt-4"></div>
        </div>

        {/* Grid of Programs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pt-6">
          {PROGRAMS.map((program) => (
            <div 
              key={program.id} 
              className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col group hover:border-cyan-500/30 transition-colors duration-500"
            >
              {/* Image Section */}
              <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-zinc-950">
                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                
                {/* Fallback styling icon in case image is missing */}
                <div className="absolute inset-0 flex items-center justify-center -z-10 bg-zinc-900">
                  <PlayCircle className="w-12 h-12 text-zinc-800" />
                </div>
                
                <Image 
                  src={program.image}
                  alt={program.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  // Using unoptimized to prevent Next.js image proxy errors if user forgets to upload
                  unoptimized 
                />
              </div>
              
              {/* Content Section */}
              <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                <h3 className="text-lg font-bold text-zinc-100 tracking-wide line-clamp-2">
                  {program.title}
                </h3>
                
                {/* Custom Styled Audio Player Container */}
                <div className="w-full pt-2">
                  <audio 
                    controls 
                    className="w-full h-10 [&::-webkit-media-controls-panel]:bg-zinc-800 [&::-webkit-media-controls-panel]:text-cyan-400"
                    preload="metadata"
                  >
                    <source src={program.audio} type="audio/mpeg" />
                    Tu navegador no soporta el reproductor de audio.
                  </audio>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl border-t border-zinc-900/60 mt-16 pt-6 text-center select-none z-10">
        <p className="text-[10px] text-zinc-500 tracking-widest uppercase font-medium">
          Radio Nostalgia Digital • <a href="https://tepuyfactory.com/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors font-semibold">TepuyFactory</a> • Sintonía del recuerdo
        </p>
      </footer>
    </div>
  );
}
