'use client';

import { useState, useEffect } from 'react';

export default function Clock() {
  const [time, setTime] = useState<string>('00:00:00');
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    
    const updateClock = () => {
      const now = new Date();
      const pad = (num: number) => String(num).padStart(2, '0');
      const hours = pad(now.getHours());
      const minutes = pad(now.getMinutes());
      const seconds = pad(now.getSeconds());
      setTime(`${hours}:${minutes}:${seconds}`);
    };

    updateClock(); // Initial run
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center space-x-2 text-zinc-500 font-mono text-sm px-3 py-1.5 bg-zinc-900/40 border border-zinc-800/60 rounded-full select-none backdrop-blur-sm">
        <span className="w-2 h-2 rounded-full bg-zinc-700 animate-pulse"></span>
        <span>--:--:--</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-zinc-100 font-mono text-sm px-3 py-1.5 bg-zinc-900/50 border border-zinc-800/80 rounded-full select-none backdrop-blur-sm shadow-inner transition-all hover:border-cyan-500/30">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
      </span>
      <span className="tracking-widest font-semibold">{time}</span>
    </div>
  );
}
