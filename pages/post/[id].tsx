import Post from '../../components/Post';
import { postApis } from '../../core/apis/posts';

import type { GetServerSideProps } from 'next';
import type { ExtendedRecordMap } from 'notion-types';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
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
  return <Post id={id} data={data} />;
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
