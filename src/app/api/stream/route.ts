import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    const statusRes = await fetch('https://sapircast.caster.fm:18243/status-json.xsl', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
      cache: 'no-store',
    });

    if (!statusRes.ok) {
      return NextResponse.json({
        streamUrl: '/api/live',
        serverReady: true,
        liveTitle: 'Señal en Vivo',
      });
    }

    const data = await statusRes.json();
    const source = data?.icestats?.source;
    const isOnline = Boolean(source);

    return NextResponse.json({
      streamUrl: '/api/live',
      serverReady: isOnline,
      liveTitle: source?.title || source?.server_name || 'Señal en Vivo',
      serverDescription: source?.server_description || 'Música de los 60, 70, 80 y 90s',
    });
  } catch {
    return NextResponse.json({
      streamUrl: '/api/live',
      serverReady: true,
      liveTitle: 'Señal en Vivo',
    });
  }
}
