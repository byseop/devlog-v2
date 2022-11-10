import Home from '../components/Home';
import { postApis } from '../core/apis/posts';

import type { Response } from '../interfaces';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export default function ({ data }: { data: Response<PageObjectResponse[]> }) {
  return <Home initialPosts={data} />;
}

export const getServerSideProps = async () => {
  try {
    const res = await postApis.getPosts();
    return { props: { data: res } };
  } catch (e) {
    console.error(e);
    return {
      notFound: true
    };
  }
};
