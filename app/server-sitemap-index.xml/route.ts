import { getServerSideSitemapIndex } from 'next-sitemap';
import { getNotionPosts } from '@/lib/notion';

export async function GET() {
  try {
    const posts = await getNotionPosts();

    return getServerSideSitemapIndex(
      posts.map((page) => `https://byseop.com/post/@${page.id}`)
    );
  } catch (e) {
    console.error(e);
    return new Response('Error generating sitemap', { status: 500 });
  }
}
