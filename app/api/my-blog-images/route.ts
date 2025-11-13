import { NextRequest, NextResponse } from 'next/server';

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

    return new NextResponse(buffer, {
      headers: {
        'Cache-Control': 'public, max-age=31536000',
        'Content-Type': response.headers.get('content-type') || 'image/jpeg'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to proxy image' },
      { status: 500 }
    );
  }
}
