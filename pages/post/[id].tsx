import Post from '../../components/Post';
import { postApis } from '../../core/apis/posts';
import { NextSeo } from 'next-seo';

import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ExtendedRecordMap } from 'notion-types';
import type {
  PageObjectResponse,
  RichTextItemResponse
} from '@notionhq/client/build/src/api-endpoints';
import type { Response } from '../../interfaces';

import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';

interface IPostPageProps {
  id: string;
  data: Response<{
    notionPage: ExtendedRecordMap;
    post: PageObjectResponse;
  }>;
}

export default function ({ id, data }: IPostPageProps) {
  const cover = data?.data.post.cover as {
    type: 'external';
    external: {
      url: TextRequest;
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

  return (
    <>
      <NextSeo
        title={title?.title[0].plain_text}
        description={subTitle?.rich_text[0].plain_text}
        openGraph={{
          url: `https://byseop.com/post/@${id}`,
          title: title?.title[0].plain_text,
          description: subTitle?.rich_text[0].plain_text,
          images: [
            {
              url: cover?.external.url,
              secureUrl: cover?.external.url,
              width: 1074,
              height: 674,
              alt: title?.title[0].plain_text,
              type: 'image/png'
            }
          ],
          siteName: 'byseop devlog'
        }}
        twitter={{
          handle: 'byseop',
          site: `https://byseop.com/post/@${id}`,
          cardType: 'summary_large_image'
        }}
      />
      <Post id={id} data={data} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await postApis.getPosts();
    return {
      paths: res.data.map((post) => `/post/@${post.id}`),
      fallback: true
    };
  } catch (e) {
    return {
      fallback: true,
      paths: []
    };
  }
};

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id?.slice(1) as string;
  if (!id) {
    return { notFound: true };
  }
  try {
    const res = await postApis.getPost(id);
    return {
      props: {
        id,
        data: res
      },
      revalidate: 60
    };
  } catch (e) {
    return {
      notFound: true
    };
  }
};
