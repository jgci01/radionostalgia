import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const CASTER_PUBLIC_TOKEN = '72cc92b4-85ec-4451-8720-83ed4f589072';

export async function GET() {
  try {
    // 1. Obtain a fresh streamToken from Caster.fm for this server's IP
    const widgetUrl = `https://widgets.cloud.caster.fm/player/?token=${CASTER_PUBLIC_TOKEN}&frameId=live&theme=dark&color=06709F`;
    const widgetRes = await fetch(widgetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
      cache: 'no-store',
    });

    if (!widgetRes.ok) {
      return new NextResponse('Stream configuration unavailable', { status: 502 });
    }

    const html = await widgetRes.text();
    const tokenMatch = html.match(/window\.casterfmCloud\.streamToken\s*=\s*'([^']+)'/);
    const streamToken = tokenMatch?.[1];

    if (!streamToken) {
      return new NextResponse('Stream token unavailable', { status: 502 });
    }

    // 2. Connect to the Icecast server from the exact same IP so the token is 100% valid
    const icecastUrl = `https://sapircast.caster.fm:18243/s7Rhf?token=${streamToken}`;
    const streamRes = await fetch(icecastUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: '*/*',
      },
      cache: 'no-store',
    });

    // Never forward 401 WWW-Authenticate headers to the browser (prevents browser password popups)
    if (!streamRes.ok || !streamRes.body) {
      return new NextResponse('Live stream offline', { status: 503 });
    }

    const contentType = streamRes.headers.get('content-type') || 'audio/ogg';

    return new NextResponse(streamRes.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch {
    return new NextResponse('Live stream connection error', { status: 503 });
  }
}
