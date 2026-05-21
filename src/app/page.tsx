import TopNav from '@/components/TopNav';
import Header from '@/components/Header';
import Player from '@/components/Player';
import NewsFeed from '@/components/NewsFeed';

// Incremental Static Regeneration (ISR): Revalidate page every 6 hours (4 times a day)
export const revalidate = 21600;

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-zinc-100 flex flex-col items-center justify-between py-12 px-4 sm:px-6 md:py-16 md:px-8 overflow-x-hidden">
      {/* Top right Navigation link */}
      <TopNav />

      {/* Decorative ambient background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-cyan-500/5 rounded-full blur-[100px] md:blur-[150px]"></div>
        <div className="absolute top-[-5%] right-[20%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-500/5 rounded-full blur-[80px] md:blur-[120px]"></div>
      </div>

      {/* Centered App Container */}
      <main className="w-full max-w-4xl flex flex-col space-y-12 md:space-y-16 relative z-10 my-auto">
        {/* Brand Header & Logo, Clock, Weather */}
        <Header />

        {/* Dynamic Centered Grid Layout (Player & RSS News) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start w-full">
          {/* Live Player widget */}
          <div className="flex justify-center w-full">
            <Player />
          </div>
          
          {/* RSS News Feed widget */}
          <div className="w-full">
            {/* Server component resolved on compilation/ISR */}
            <NewsFeed />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl border-t border-zinc-900/60 mt-16 pt-6 text-center select-none z-10">
        <p className="text-[10px] text-zinc-500 tracking-widest uppercase font-medium">
          © {new Date().getFullYear()} Radio Nostalgia Digital • Mendoza, Argentina • Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
