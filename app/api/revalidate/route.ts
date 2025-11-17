import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const postId = searchParams.get('postId');
  const secret = searchParams.get('secret');

  // Optional: Add a secret token to prevent unauthorized revalidation
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  if (!postId) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 });
  }

  try {
    // Revalidate by tag
    const tag = `post-${postId}`;
    revalidateTag(tag, 'page');

    console.log(`[Revalidate] Successfully revalidated tag: ${tag} for post ${postId}`);

    return NextResponse.json({
      revalidated: true,
      postId,
      tag,
      now: Date.now(),
      message: 'Cache cleared for this post. Next request will rebuild the page.'
    });
  } catch (error) {
    console.error(`[Revalidate] Error revalidating post ${postId}:`, error);
    return NextResponse.json(
      {
        error: 'Error revalidating',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
