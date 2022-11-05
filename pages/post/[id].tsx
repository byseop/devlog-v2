import Post from '../../components/Post';
import { NotionAPI } from 'notion-client';

import type { GetServerSideProps } from 'next';
import type { ExtendedRecordMap } from 'notion-types';

import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';

interface IPostPageProps {
  id: string;
  data: ExtendedRecordMap;
}

const notion = new NotionAPI();

export default function ({ id, data }: IPostPageProps) {
  return <Post id={id} data={data} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id?.slice(1) as string;
  if (!id) {
    return { notFound: true };
  }

  try {
    const res = await notion.getPage(id);
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
