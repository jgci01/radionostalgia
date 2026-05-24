import Link from 'next/link';
import { Info, ListMusic } from 'lucide-react';

export default function TopNav() {
  return (
    <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex flex-col items-end space-y-2">
      <Link
        href="/quienes-somos"
        className="flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-zinc-100 bg-zinc-900/60 hover:bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/80 hover:border-zinc-700/80 px-3.5 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-cyan-950/20 select-none"
      >
        <Info className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
        <span className="font-semibold tracking-wide">Quiénes Somos</span>
      </Link>
      
      <Link
        href="/programacion"
        className="flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-zinc-100 bg-zinc-900/60 hover:bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/80 hover:border-zinc-700/80 px-3.5 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-cyan-950/20 select-none group"
      >
        <ListMusic className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
        <span className="font-semibold tracking-wide">Programación</span>
      </Link>
    </div>
  );
}
