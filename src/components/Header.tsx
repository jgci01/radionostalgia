import Image from 'next/image';
import Clock from './Clock';
import Weather from './Weather';

export default function Header() {
  return (
    <div className="flex flex-col items-center text-center space-y-6 md:space-y-8 select-none">
      {/* Brand Logo Container */}
      <div className="relative group">
        {/* Soft glowing cyan light behind logo */}
        <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-all duration-700 scale-90"></div>
        
        <div className="relative p-1.5 bg-zinc-900/60 border border-zinc-800/80 rounded-full shadow-2xl backdrop-blur-sm group-hover:border-cyan-500/30 transition-all duration-500 overflow-hidden">
          <Image
            src="/logo.png"
            alt="Radio Nostalgia Digital Logo"
            width={200}
            height={200}
            priority
            className="rounded-full object-cover transform duration-700 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Brand Title Block */}
      <div className="space-y-2 max-w-md mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-100 bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-400 bg-clip-text text-transparent">
          Radio Nostalgia Digital
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 font-medium tracking-widest uppercase">
          La sintonía del recuerdo en la web
        </p>
      </div>

      {/* Widgets row (Clock & Weather) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
        <Clock />
        <Weather />
      </div>
    </div>
  );
}
