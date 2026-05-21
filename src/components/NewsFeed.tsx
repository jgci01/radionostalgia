import Parser from 'rss-parser';
import { Newspaper, ExternalLink } from 'lucide-react';

interface NewsItem {
  title: string;
  link: string;
  pubDate?: string;
  relativeTime: string;
}

// Fallback items in case RSS fails
const FALLBACK_NEWS: NewsItem[] = [
  {
    title: 'El auge del vinilo y el coleccionismo de clásicos musicales en la era digital',
    link: 'https://www.lanacion.com.ar',
    relativeTime: 'Hace 2 horas',
  },
  {
    title: 'Mendoza se consolida como el destino preferido para los amantes del buen vino y la música',
    link: 'https://www.lanacion.com.ar',
    relativeTime: 'Hace 4 horas',
  },
  {
    title: 'La nostalgia en los medios digitales: por qué seguimos buscando el sonido de los años 80 y 90',
    link: 'https://www.lanacion.com.ar',
    relativeTime: 'Hace 6 horas',
  },
  {
    title: 'Nuevas tecnologías de streaming permiten transmisiones de audio de alta fidelidad sin interrupciones',
    link: 'https://www.lanacion.com.ar',
    relativeTime: 'Hace 8 horas',
  },
];

function getRelativeTime(dateString?: string): string {
  if (!dateString) return 'Hace unas horas';
  try {
    const now = new Date();
    const past = new Date(dateString);
    if (isNaN(past.getTime())) return 'Hace unas horas';
    
    const diffMs = now.getTime() - past.getTime();
    
    // Safety check for future dates or slight clock drift
    if (diffMs < 0) return 'Hace un momento';
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    }
    if (diffHours > 0) {
      return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    }
    if (diffMins > 0) {
      return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    }
    return 'Hace un momento';
  } catch (e) {
    return 'Hace unas horas';
  }
}

export default async function NewsFeed() {
  let newsItems: NewsItem[] = [];

  try {
    const parser = new Parser({
      timeout: 5000, // 5 seconds timeout to guarantee fast page loads
    });
    
    const feed = await parser.parseURL(
      'https://servicios.lanacion.com.ar/winformatos/rss/canal/categoria=7793'
    );

    if (feed && feed.items) {
      newsItems = feed.items.slice(0, 4).map((item) => ({
        title: item.title || 'Noticia sin título',
        link: item.link || 'https://www.lanacion.com.ar',
        pubDate: item.pubDate,
        relativeTime: getRelativeTime(item.pubDate),
      }));
    }
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    // Graceful degradation: Use high quality fallback items
    newsItems = FALLBACK_NEWS;
  }

  // Ensure we always have exactly 4 items
  if (newsItems.length < 4) {
    newsItems = [...newsItems, ...FALLBACK_NEWS.slice(newsItems.length, 4)];
  } else if (newsItems.length > 4) {
    newsItems = newsItems.slice(0, 4);
  }

  return (
    <div className="w-full bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 md:p-8 shadow-2xl transition-all duration-300 hover:border-cyan-500/20">
      <div className="flex items-center space-x-3 border-b border-zinc-800/50 pb-4 mb-5">
        <div className="p-2 bg-cyan-950/40 border border-cyan-500/20 rounded-lg">
          <Newspaper className="w-5 h-5 text-cyan-400" />
        </div>
        <h2 className="text-zinc-100 font-bold tracking-tight text-lg md:text-xl">Noticias</h2>
      </div>

      <div className="divide-y divide-zinc-850">
        {newsItems.map((item, index) => (
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
              <span className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase mt-1 block">
                {item.relativeTime}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-zinc-500 group-hover:text-cyan-400 transition-colors duration-200 mt-2 md:mt-0 font-medium shrink-0">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">Leer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
