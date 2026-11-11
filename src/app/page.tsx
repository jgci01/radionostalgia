import Link from 'next/link';
import { ListMusic, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Player from '@/components/Player';
import NewsFeed from '@/components/NewsFeed';

// Incremental Static Regeneration (ISR): Revalidate page every 6 hours (4 times a day)
export const revalidate = 21600;

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-zinc-100 flex flex-col items-center justify-between py-10 px-4 sm:px-6 md:py-14 md:px-8 overflow-x-hidden">
      {/* Decorative ambient background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-cyan-500/5 rounded-full blur-[100px] md:blur-[150px]"></div>
        <div className="absolute top-[-5%] right-[20%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-500/5 rounded-full blur-[80px] md:blur-[120px]"></div>
      </div>

      {/* Centered App Container */}
      <main className="w-full max-w-4xl flex flex-col space-y-12 md:space-y-14 relative z-10 my-auto">
        {/* Brand Header & Spinning Vinyl Logo, Clock, Weather */}
        <Header />

        {/* Dynamic Centered Grid Layout (Player & RSS News) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start w-full">
          {/* Live & Auto-DJ Player widget */}
          <div className="flex justify-center w-full">
            <Player />
          </div>

          {/* RSS News Feed widget */}
          <div className="w-full">
            <NewsFeed />
          </div>
        </div>

        {/* Featured Programming Banner */}
        <div className="w-full bg-gradient-to-r from-zinc-900/60 via-cyan-950/25 to-zinc-900/60 border border-zinc-800/80 hover:border-cyan-500/30 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl transition-all">
          <div className="flex items-center space-x-4 text-center sm:text-left">
            <div className="hidden sm:flex p-3 rounded-xl bg-cyan-950/50 border border-cyan-500/20 text-cyan-400 shrink-0">
              <ListMusic className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 block">
                Fonoteca On-Demand
              </span>
              <h3 className="text-sm sm:text-base font-bold text-zinc-100">
                Explora nuestros 7 programas especiales del recuerdo
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Cantares Latinoamericanos, El Baúl de los Recuerdos, Nostalgia Vallenata, El Rincón de Juancho y más.
              </p>
            </div>
          </div>

          <Link
            href="/programacion"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all shrink-0"
          >
            <span>Ver Programación</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl border-t border-zinc-900/60 mt-16 pt-6 text-center select-none z-10">
        <p className="text-[10px] text-zinc-500 tracking-widest uppercase font-medium">
          © {new Date().getFullYear()} Radio Nostalgia Digital •{' '}
          <a
            href="https://tepuyfactory.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors font-semibold"
          >
            TepuyFactory
          </a>{' '}
          • Mendoza, Argentina • Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
