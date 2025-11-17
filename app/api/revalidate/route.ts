import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path');
  const secret = searchParams.get('secret');

  // Optional: Add a secret token to prevent unauthorized revalidation
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  if (!path) {
    return NextResponse.json({ error: 'Path is required' }, { status: 400 });
  }

  try {
    // Use 'page' type to revalidate the entire page including all layouts
    revalidatePath(path, 'page');

    console.log(`[Revalidate] Successfully revalidated path: ${path}`);

    return NextResponse.json({
      revalidated: true,
      path,
      now: Date.now(),
      message: 'Page cache cleared. Next request will rebuild the page.'
    });
  } catch (error) {
    console.error(`[Revalidate] Error revalidating path ${path}:`, error);
    return NextResponse.json(
      {
        error: 'Error revalidating',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
