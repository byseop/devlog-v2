import { NextRequest, NextResponse } from 'next/server';

function getNotionUrlExpiration(url: string): number | null {
  try {
    const urlObj = new URL(url);
    // Notion URLs have expiration in 'X-Amz-Expires' query parameter (in seconds)
    const expires = urlObj.searchParams.get('X-Amz-Expires');
    // And 'X-Amz-Date' tells when the URL was signed
    const signedDate = urlObj.searchParams.get('X-Amz-Date');

    if (expires && signedDate) {
      // Parse X-Amz-Date format: YYYYMMDDTHHMMSSZ
      const year = parseInt(signedDate.substring(0, 4));
      const month = parseInt(signedDate.substring(4, 6)) - 1;
      const day = parseInt(signedDate.substring(6, 8));
      const hour = parseInt(signedDate.substring(9, 11));
      const minute = parseInt(signedDate.substring(11, 13));
      const second = parseInt(signedDate.substring(13, 15));

      const signedTime = new Date(
        Date.UTC(year, month, day, hour, minute, second)
      );
      const expirationTime = signedTime.getTime() + parseInt(expires) * 1000;
      const now = Date.now();

      // Return seconds until expiration
      return Math.max(0, Math.floor((expirationTime - now) / 1000));
    }
  } catch (error) {
    // If parsing fails, return null
  }
  return null;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  const decodedUrl = decodeURIComponent(url);

  try {
    const response = await fetch(decodedUrl, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        Referer: 'https://www.notion.so/',
        Origin: 'https://www.notion.so'
      },
      redirect: 'follow'
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to proxy image' },
        { status: 500 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get the actual expiration time from Notion URL
    const ttl = getNotionUrlExpiration(decodedUrl);

    // If we can determine TTL, use it minus a safety margin (5 minutes)
    // Otherwise fall back to 1 hour
    const maxAge = ttl ? Math.max(300, ttl - 300) : 3600;
    const staleWhileRevalidate = 86400; // 24 hours

    return new NextResponse(buffer, {
      headers: {
        'Cache-Control': `public, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
        'X-Cache-TTL': ttl?.toString() || 'unknown',
        'X-Cache-Max-Age': maxAge.toString()
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to proxy image' },
      { status: 500 }
    );
  }
}
