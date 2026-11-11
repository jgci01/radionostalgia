import Parser from 'rss-parser';
import NewsFeedClient from './NewsFeedClient';

export interface NewsItem {
  title: string;
  link: string;
  pubDate?: string;
  relativeTime: string;
  sourceName: string;
  region: 'nacional' | 'internacional';
  timestamp: number;
}

const RSS_FEEDS: {
  name: string;
  url: string;
  region: 'nacional' | 'internacional';
}[] = [
  {
    name: 'La Nación',
    url: 'https://servicios.lanacion.com.ar/winformatos/rss/canal/categoria=7793',
    region: 'nacional',
  },
  {
    name: 'MDZ Online',
    url: 'https://www.mdzol.com/files/rss/todoslostitulos.xml',
    region: 'nacional',
  },
  {
    name: 'Infobae',
    url: 'https://www.infobae.com/feeds/rss',
    region: 'nacional',
  },
  {
    name: 'El Nacional',
    url: 'https://www.elnacional.com/feed/',
    region: 'internacional',
  },
  {
    name: 'Radio Bío Bío',
    url: 'https://www.biobiochile.cl/portada/feed/',
    region: 'internacional',
  },
];

// Fallback items in case RSS feeds fail
const FALLBACK_NEWS: NewsItem[] = [
  {
    title: 'El auge del vinilo y el coleccionismo de clásicos musicales en la era digital',
    link: 'https://www.lanacion.com.ar',
    relativeTime: 'Hace 2 horas',
    sourceName: 'La Nación',
    region: 'nacional',
    timestamp: Date.now() - 7200000,
  },
  {
    title: 'Mendoza se consolida como el destino preferido para los amantes del buen vino y la música',
    link: 'https://www.mdzol.com',
    relativeTime: 'Hace 4 horas',
    sourceName: 'MDZ Online',
    region: 'nacional',
    timestamp: Date.now() - 14400000,
  },
  {
    title: 'La nostalgia en los medios digitales: por qué seguimos buscando el sonido de los años 80 y 90',
    link: 'https://www.infobae.com',
    relativeTime: 'Hace 6 horas',
    sourceName: 'Infobae',
    region: 'nacional',
    timestamp: Date.now() - 21600000,
  },
  {
    title: 'Reportaje: La historia viva de la radiofonía latinoamericana y sus grandes voces',
    link: 'https://www.elnacional.com',
    relativeTime: 'Hace 7 horas',
    sourceName: 'El Nacional',
    region: 'internacional',
    timestamp: Date.now() - 25200000,
  },
  {
    title: 'Nuevas tecnologías de streaming permiten transmisiones de audio de alta fidelidad',
    link: 'https://www.biobiochile.cl',
    relativeTime: 'Hace 8 horas',
    sourceName: 'Radio Bío Bío',
    region: 'internacional',
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
  } catch {
    return 'Hace unas horas';
  }
}

function parseDateSafely(dateString?: string): number {
  if (!dateString) return 0;
  const parsed = new Date(dateString).getTime();
  return isNaN(parsed) ? 0 : parsed;
}

export default async function NewsFeed() {
  let featuredItems: NewsItem[] = [];
  let allCollectedItems: NewsItem[] = [];

  const parser = new Parser({
    timeout: 5000,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });

  try {
    const results = await Promise.allSettled(
      RSS_FEEDS.map(async (feed) => {
        const data = await parser.parseURL(feed.url);
        return { feedName: feed.name, region: feed.region, items: data.items };
      })
    );

    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.items) {
        const { feedName, region, items } = result.value;
        const feedItems: NewsItem[] = items.map((item) => ({
          title: item.title || 'Noticia sin título',
          link: item.link || '#',
          pubDate: item.pubDate,
          relativeTime: getRelativeTime(item.pubDate),
          sourceName: feedName,
          region,
          timestamp: parseDateSafely(item.pubDate),
        }));

        feedItems.sort((a, b) => b.timestamp - a.timestamp);

        if (feedItems.length > 0) {
          featuredItems.push(feedItems[0]);
          allCollectedItems.push(...feedItems.slice(0, 3));
        }
      }
    });
  } catch (error) {
    console.error('Critical error processing RSS feeds:', error);
  }

  if (featuredItems.length > 0) {
    featuredItems.sort((a, b) => b.timestamp - a.timestamp);
    featuredItems = featuredItems.filter((item) => item.timestamp > 0);
  }

  if (allCollectedItems.length > 0) {
    allCollectedItems.sort((a, b) => b.timestamp - a.timestamp);
    allCollectedItems = allCollectedItems.filter((item) => item.timestamp > 0);
  }

  if (featuredItems.length < 5) {
    const missingCount = 5 - featuredItems.length;
    featuredItems = [...featuredItems, ...FALLBACK_NEWS.slice(0, missingCount)];
  }

  if (allCollectedItems.length < 5) {
    allCollectedItems = [...allCollectedItems, ...FALLBACK_NEWS];
  }

  return (
    <NewsFeedClient
      featuredItems={featuredItems.slice(0, 5)}
      allItems={allCollectedItems}
    />
  );
}
