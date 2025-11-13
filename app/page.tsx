import Home from '@components/Home';
import { getNotionPosts } from '@/lib/notion';
import { createApiSuccessResponse } from '@core/utils';

export const revalidate = 3600; // 1 hour

export default async function HomePage() {
  const posts = await getNotionPosts();
  const data = createApiSuccessResponse(posts);

  return <Home initialPosts={data} />;
}
