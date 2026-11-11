'use client';

import { useState } from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';
import type { NewsItem } from './NewsFeed';

type FilterTab = 'destacadas' | 'nacional' | 'internacional';

const SOURCE_STYLES: Record<string, string> = {
  'MDZ Online': 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
  'La Nación': 'text-sky-400 border-sky-500/30 bg-sky-950/40',
  Infobae: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
  'El Nacional': 'text-indigo-400 border-indigo-500/30 bg-indigo-950/40',
  'Radio Bío Bío': 'text-rose-400 border-rose-500/30 bg-rose-950/40',
};

export default function NewsFeedClient({
  featuredItems,
  allItems,
}: {
  featuredItems: NewsItem[];
  allItems: NewsItem[];
}) {
  const [activeTab, setActiveTab] = useState<FilterTab>('destacadas');

  const filteredItems = (() => {
    if (activeTab === 'destacadas') return featuredItems.slice(0, 5);
    if (activeTab === 'nacional') {
      const list = allItems.filter((i) => i.region === 'nacional');
      return (list.length > 0 ? list : featuredItems).slice(0, 5);
    }
    const list = allItems.filter((i) => i.region === 'internacional');
    return (list.length > 0 ? list : featuredItems).slice(0, 5);
  })();

  return (
    <div className="w-full bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 md:p-7 shadow-2xl transition-all duration-300 hover:border-cyan-500/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/50 pb-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-950/40 border border-cyan-500/20 rounded-lg">
            <Newspaper className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <span className="text-[10px] tracking-widest text-cyan-400 uppercase font-semibold block">
              Actualidad al Día
            </span>
            <h2 className="text-zinc-100 font-bold tracking-tight text-base md:text-lg">
              Últimas Noticias
            </h2>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center space-x-1 bg-zinc-950/70 border border-zinc-800/80 p-1 rounded-xl self-start sm:self-auto">
          {[
            { id: 'destacadas', label: 'Destacadas' },
            { id: 'nacional', label: 'Argentina' },
            { id: 'internacional', label: 'Mundo' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as FilterTab)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-zinc-850">
        {filteredItems.map((item, index) => {
          const badgeStyle =
            SOURCE_STYLES[item.sourceName] ||
            'text-cyan-400 border-cyan-500/20 bg-cyan-950/30';

          return (
            <a
              key={`${item.sourceName}-${index}`}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col md:flex-row md:items-center justify-between py-3.5 first:pt-0 last:pb-0 transition-colors duration-200"
            >
              <div className="flex-1 pr-4">
                <h3 className="text-zinc-200 text-sm font-medium leading-relaxed group-hover:text-cyan-400 transition-colors duration-200 line-clamp-2">
                  {item.title}
                </h3>
                <div className="flex items-center space-x-2 mt-1.5">
                  <span
                    className={`text-[10px] font-bold tracking-wider uppercase border px-1.5 py-0.5 rounded ${badgeStyle}`}
                  >
                    {item.sourceName}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase">
                    {item.relativeTime}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs text-zinc-500 group-hover:text-cyan-400 transition-colors duration-200 mt-2 md:mt-0 font-medium shrink-0">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Leer
                </span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
