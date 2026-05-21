import Parser from 'rss-parser';
import { Newspaper, ExternalLink } from 'lucide-react';

interface NewsItem {
  title: string;
  link: string;
  pubDate?: string;
  relativeTime: string;
  sourceName: string;
  timestamp: number;
}

const RSS_FEEDS = [
  { name: 'La Nación', url: 'https://servicios.lanacion.com.ar/winformatos/rss/canal/categoria=7793' },
  { name: 'MDZ Online', url: 'https://www.mdzol.com/files/rss/todoslostitulos.xml' },
  { name: 'Infobae', url: 'https://www.infobae.com/feeds/rss' },
  { name: 'El Nacional', url: 'http://www.el-nacional.com/rss/' },
  { name: 'Radio Bío Bío', url: 'http://www.radiobiobio.cl/feed/' }
];

// Fallback items in case all RSS feeds fail
const FALLBACK_NEWS: NewsItem[] = [
  {
    title: 'El auge del vinilo y el coleccionismo de clásicos musicales en la era digital',
    link: 'https://www.lanacion.com.ar',
    relativeTime: 'Hace 2 horas',
    sourceName: 'La Nación',
    timestamp: Date.now() - 7200000,
  },
  {
    title: 'Mendoza se consolida como el destino preferido para los amantes del buen vino y la música',
    link: 'https://www.mdzol.com',
    relativeTime: 'Hace 4 horas',
    sourceName: 'MDZ Online',
    timestamp: Date.now() - 14400000,
  },
  {
    title: 'La nostalgia en los medios digitales: por qué seguimos buscando el sonido de los años 80 y 90',
    link: 'https://www.infobae.com',
    relativeTime: 'Hace 6 horas',
    sourceName: 'Infobae',
    timestamp: Date.now() - 21600000,
  },
  {
    title: 'Reportaje: La historia de la radiofonía latinoamericana',
    link: 'http://www.el-nacional.com',
    relativeTime: 'Hace 7 horas',
    sourceName: 'El Nacional',
    timestamp: Date.now() - 25200000,
  },
  {
    title: 'Nuevas tecnologías de streaming permiten transmisiones de audio de alta fidelidad',
    link: 'https://www.biobiochile.cl',
    relativeTime: 'Hace 8 horas',
    sourceName: 'Radio Bío Bío',
    timestamp: Date.now() - 28800000,
  },
];

function getRelativeTime(dateString?: string): string {
  if (!dateString) return 'Hace unas horas';
  try {
    const now = new Date();
    const past = new Date(dateString);
    if (isNaN(past.getTime())) return 'Hace unas horas';
    
    const diffMs = now.getTime() - past.getTime();
    if (diffMs < 0) return 'Hace un momento';
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    if (diffHours > 0) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    if (diffMins > 0) return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    return 'Hace un momento';
  } catch (e) {
    return 'Hace unas horas';
  }
}

function parseDateSafely(dateString?: string): number {
  if (!dateString) return 0;
  const parsed = new Date(dateString).getTime();
  return isNaN(parsed) ? 0 : parsed;
}

export default async function NewsFeed() {
  let allNewsItems: NewsItem[] = [];

  const parser = new Parser({
    timeout: 5000, // 5 seconds timeout to guarantee fast page loads
  });

  try {
    // Fetch all RSS feeds in parallel, settling them independently
    const results = await Promise.allSettled(
      RSS_FEEDS.map(async (feed) => {
        const data = await parser.parseURL(feed.url);
        return { feedName: feed.name, items: data.items };
      })
    );

    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.items) {
        const { feedName, items } = result.value;
        const feedItems = items.map((item) => ({
          title: item.title || 'Noticia sin título',
          link: item.link || '#',
          pubDate: item.pubDate,
          relativeTime: getRelativeTime(item.pubDate),
          sourceName: feedName,
          timestamp: parseDateSafely(item.pubDate),
        }));
        
        // Sort items from this specific source by newest first
        feedItems.sort((a, b) => b.timestamp - a.timestamp);
        
        // Take ONLY the single freshest article from this source
        if (feedItems.length > 0) {
          allNewsItems.push(feedItems[0]);
        }
      }
    });

  } catch (error) {
    console.error('Critical error processing RSS feeds:', error);
  }

  // Sort the final 5 items (one from each source) by newest first across all sources
  if (allNewsItems.length > 0) {
    allNewsItems.sort((a, b) => b.timestamp - a.timestamp);
    allNewsItems = allNewsItems.filter(item => item.timestamp > 0);
  }

  // If still empty or filtered to 0, use fallback
  if (allNewsItems.length === 0) {
    allNewsItems = FALLBACK_NEWS;
  }

  // Take exactly 5 items
  const displayItems = allNewsItems.slice(0, 5);

  return (
    <div className="w-full bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 md:p-8 shadow-2xl transition-all duration-300 hover:border-cyan-500/20">
      <div className="flex items-center space-x-3 border-b border-zinc-800/50 pb-4 mb-5">
        <div className="p-2 bg-cyan-950/40 border border-cyan-500/20 rounded-lg">
          <Newspaper className="w-5 h-5 text-cyan-400" />
        </div>
        <h2 className="text-zinc-100 font-bold tracking-tight text-lg md:text-xl">Últimas Noticias</h2>
      </div>

      <div className="divide-y divide-zinc-850">
        {displayItems.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col md:flex-row md:items-center justify-between py-4 first:pt-0 last:pb-0 transition-colors duration-200"
          >
            <div className="flex-1 pr-4">
              <h3 className="text-zinc-200 text-sm font-medium leading-relaxed group-hover:text-cyan-400 transition-colors duration-200 line-clamp-2 md:line-clamp-1">
                {item.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1.5">
                <span className="text-[10px] text-cyan-500 font-bold tracking-wider uppercase border border-cyan-500/20 bg-cyan-950/30 px-1.5 py-0.5 rounded">
                  {item.sourceName}
                </span>
                <span className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase">
                  {item.relativeTime}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs text-zinc-500 group-hover:text-cyan-400 transition-colors duration-200 mt-3 md:mt-0 font-medium shrink-0">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">Leer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
