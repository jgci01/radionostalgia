'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Radio,
  ListMusic,
  Info,
  MessageCircleHeart,
  X,
  Send,
  Sparkles,
} from 'lucide-react';
import { useRadio } from '@/context/RadioContext';

export default function TopNav() {
  const pathname = usePathname();
  const { isPlaying, togglePlay, mode, currentProgram } = useRadio();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [listenerName, setListenerName] = useState('');
  const [listenerCity, setListenerCity] = useState('');
  const [songRequest, setSongRequest] = useState('');

  const navItems = [
    { href: '/', label: 'En Vivo', icon: Radio },
    { href: '/programacion', label: 'Programación', icon: ListMusic },
    { href: '/quienes-somos', label: 'Quiénes Somos', icon: Info },
  ];

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const namePart = listenerName.trim() ? `Soy ${listenerName.trim()}` : 'Hola';
    const cityPart = listenerCity.trim() ? ` desde ${listenerCity.trim()}` : '';
    const message = `¡Hola Radio Nostalgia Digital! 📻✨ ${namePart}${cityPart}. Estoy escuchando la radio y me gustaría pedir/saludar: ${songRequest.trim()}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsRequestModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/75 border-b border-zinc-800/70 transition-all">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Left Brand Mini-Identity */}
          <Link
            href="/"
            className="flex items-center space-x-2.5 group shrink-0"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-cyan-500/40 shadow-md shadow-cyan-950/30">
              <Image
                src="/logo.png"
                alt="Radio Nostalgia Digital"
                fill
                sizes="36px"
                className={`object-cover ${isPlaying ? 'animate-spin-slow' : ''}`}
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-extrabold tracking-tight text-zinc-100 group-hover:text-cyan-400 transition-colors">
                RADIO NOSTALGIA
              </span>
              <span className="text-[10px] text-zinc-400 tracking-widest uppercase">
                {isPlaying
                  ? mode === 'live'
                    ? '● En Vivo'
                    : `● ${currentProgram.title}`
                  : 'Mendoza, AR'}
              </span>
            </div>
          </Link>

          {/* Center Navigation Pills */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 bg-zinc-900/70 border border-zinc-800/80 p-1 rounded-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950/50'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={togglePlay}
              className={`hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                  : 'bg-zinc-900/80 border-zinc-700/80 text-zinc-300 hover:border-cyan-500/40 hover:text-cyan-300'
              }`}
              title={isPlaying ? 'Pausar reproducción' : 'Sintonizar ahora'}
            >
              <span className="relative flex h-2 w-2">
                {isPlaying && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isPlaying ? 'bg-emerald-400' : 'bg-cyan-400'
                  }`}
                ></span>
              </span>
              <span>{isPlaying ? 'Al Aire' : 'Sintonizar'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsRequestModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-600/30 to-indigo-600/30 hover:from-cyan-500/40 hover:to-indigo-500/40 text-cyan-200 border border-cyan-500/30 shadow-md transition-all cursor-pointer"
              title="Pedir una canción o enviar saludo a la cabina"
            >
              <MessageCircleHeart className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Pedir Tema</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modal de Cabina en Vivo / Pedidos Musicales */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsRequestModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 bg-cyan-950/60 border border-cyan-500/30 rounded-xl text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">
                  Cabina Interactiva
                </span>
                <h3 className="text-lg font-bold text-zinc-100">
                  Pide tu Clásico o Envía un Saludo
                </h3>
              </div>
            </div>

            <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
              Cuéntanos desde dónde nos escuchas y qué joya musical del recuerdo te gustaría escuchar en nuestra programación.
            </p>

            <form onSubmit={handleSendRequest} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Tu Nombre
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Carlos Gómez"
                    value={listenerName}
                    onChange={(e) => setListenerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Ciudad / País
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Mendoza, Argentina"
                    value={listenerCity}
                    onChange={(e) => setListenerCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Canción pedida o saludo especial
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ej: Quiero pedir un tema de Los Ángeles Negros y saludar a mi familia..."
                  value={songRequest}
                  onChange={(e) => setSongRequest(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar por WhatsApp</span>
                </button>
                <a
                  href="https://www.twitch.tv/nostalgiadigital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs rounded-xl text-center transition-colors shrink-0"
                >
                  Chat en Twitch
                </a>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
