'use client';

import { useState, useEffect } from 'react';

export default function Clock() {
  const [time, setTime] = useState<string>('00:00:00');
  const [dateLabel, setDateLabel] = useState<string>('');
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    const updateClock = () => {
      const now = new Date();
      try {
        const timeStr = new Intl.DateTimeFormat('es-AR', {
          timeZone: 'America/Argentina/Mendoza',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(now);

        const dateStr = new Intl.DateTimeFormat('es-AR', {
          timeZone: 'America/Argentina/Mendoza',
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }).format(now);

        setTime(timeStr);
        setDateLabel(dateStr.replace('.', ''));
      } catch {
        const pad = (num: number) => String(num).padStart(2, '0');
        setTime(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center space-x-2 text-zinc-500 font-mono text-xs px-3.5 py-1.5 bg-zinc-900/40 border border-zinc-800/60 rounded-full select-none backdrop-blur-sm">
        <span className="w-2 h-2 rounded-full bg-zinc-700 animate-pulse"></span>
        <span>--:--:--</span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center space-x-2 text-zinc-100 text-xs px-3.5 py-1.5 bg-zinc-900/50 border border-zinc-800/80 rounded-full select-none backdrop-blur-sm shadow-inner transition-all hover:border-cyan-500/30"
      title="Hora oficial de Mendoza, Argentina"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
      </span>
      {dateLabel && (
        <>
          <span className="text-zinc-400 capitalize font-medium">{dateLabel}</span>
          <span className="text-zinc-600">•</span>
        </>
      )}
      <span className="font-mono tracking-widest font-semibold">{time}</span>
    </div>
  );
}
