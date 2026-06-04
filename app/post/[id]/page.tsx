import Post from '@components/Post';
import { getNotionPost, getNotionPosts } from '@/lib/notion';
import { createApiSuccessResponse } from '@core/utils';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import type {
  PageObjectResponse,
  RichTextItemResponse
} from '@notionhq/client/build/src/api-endpoints';

// Cache for 1 year (31536000 seconds)
// Use on-demand revalidation via /api/revalidate to update when needed
export const revalidate = 31536000;

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params
}: PostPageProps): Promise<Metadata> {
  const { id } = await params;
  const postId = getCleanId(id);

  try {
    const postData = await getNotionPost(postId);
    const data = createApiSuccessResponse(postData);

    const cover = data?.data.post.cover as {
      type: 'external';
      external: {
        url: string;
      };
    };

    const title = data?.data.post.properties.title as {
      type: 'title';
      title: Array<RichTextItemResponse>;
      id: string;
    };

    const subTitle = data?.data.post.properties.subTitle as {
      type: 'rich_text';
      rich_text: Array<RichTextItemResponse>;
      id: string;
    };

    const titleText = title?.title[0]?.plain_text || 'byseop devlog';
    const descriptionText =
      subTitle?.rich_text[0]?.plain_text || 'byseop devlog';
    const imageUrl = cover?.external?.url;

    return {
      title: titleText,
      description: descriptionText,
      openGraph: {
        url: `https://byseop.com/post/${id}`,
        title: titleText,
        description: descriptionText,
        images: imageUrl
          ? [
              {
                url: imageUrl,
                secureUrl: imageUrl,
                width: 1074,
                height: 674,
                alt: titleText,
                type: 'image/png'
              }
            ]
          : undefined,
        siteName: 'byseop devlog'
      },
      twitter: {
        card: 'summary_large_image',
        site: `https://byseop.com/post/${id}`,
        creator: 'byseop'
      }
    };
  } catch (e) {
    return {
      title: 'byseop devlog',
      description: 'byseop devlog'
    };
  }
}

export async function generateStaticParams() {
  try {
    const posts = await getNotionPosts();
    return posts.map((post: PageObjectResponse) => ({
      id: getCleanId(post.id)
    }));
  } catch (e) {
    return [];
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  const decoded = decodeURIComponent(id);

  // Internal/legacy links carry an "@"-prefixed id (see Post linkMapper).
  // Redirect them to the canonical, prerendered path instead of rendering
  // dynamically, which can throw inside react-notion-x.
  if (decoded.startsWith('@')) {
    redirect(`/post/${decoded.slice(1)}`);
  }

  try {
    const postData = await getNotionPost(decoded);
    const data = createApiSuccessResponse(postData);
    return <Post id={decoded} data={data} />;
  } catch {
    notFound();
  }
}

const getCleanId = (id: string) =>
  decodeURIComponent(id).startsWith('@') ? decodeURIComponent(id).slice(1) : id;
