import { NextResponse } from 'next/server';

const CASTER_PUBLIC_TOKEN = '72cc92b4-85ec-4451-8720-83ed4f589072';
const DEFAULT_STREAM_URL =
  'https://sapircast.caster.fm:18243/s7Rhf?token=568f6c35837c77060df6bd2e49416bd3';

export const revalidate = 300; // Revalidar cada 5 minutos para cuidar créditos de servidor

export async function GET() {
  try {
    const widgetUrl = `https://widgets.cloud.caster.fm/player/?token=${CASTER_PUBLIC_TOKEN}&frameId=autoplay&theme=dark&color=06709F`;
    const response = await fetch(widgetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json({
        streamUrl: DEFAULT_STREAM_URL,
        serverReady: false,
      });
    }

    const html = await response.text();
    const tokenMatch = html.match(/window\.casterfmCloud\.streamToken\s*=\s*'([^']+)'/);
    const accountMatch = html.match(/window\.casterfmCloud\.account\s*=\s*(\{[\s\S]*?\});/);

    let domain = 'sapircast.caster.fm';
    let port = 18243;
    let mountpoint = 's7Rhf';
    let serverReady = false;

    if (accountMatch?.[1]) {
      try {
        const account = JSON.parse(accountMatch[1]);
        domain = account.streaming_server_domain || domain;
        port = account.streaming_server_port || port;
        mountpoint = account.streaming_server_mountpoint || mountpoint;
        serverReady = Boolean(account.streaming_server_ready);
      } catch {
        // Fallback to defaults if JSON parsing fails
      }
    }

    const streamToken = tokenMatch?.[1] || '568f6c35837c77060df6bd2e49416bd3';
    const streamUrl = `https://${domain}:${port}/${mountpoint}?token=${streamToken}`;

    return NextResponse.json({
      streamUrl,
      serverReady,
    });
  } catch {
    return NextResponse.json({
      streamUrl: DEFAULT_STREAM_URL,
      serverReady: false,
    });
  }
}
