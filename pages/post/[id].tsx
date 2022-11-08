import Post from '../../components/Post';
import { postApis } from '../../core/apis/posts';
import Meta from '../../components/Meta';

import type { GetServerSideProps } from 'next';
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
      <Meta
        title={title.title[0].plain_text || ''}
        description={subTitle.rich_text[0].plain_text || ''}
        url={`https://byseop.com/post/@${id}`}
      />
      <Post id={id} data={data} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
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
      }
    };
  } catch (e) {
    return {
      notFound: true
    };
  }
};
