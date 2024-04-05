import Home from '@components/Home';
import { postApis } from '@core/apis/posts';
import { GetStaticProps } from 'next';

import type { Response } from '@interfaces/index';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export default function HomePage({
  data
}: {
  data: Response<PageObjectResponse[]>;
}) {
  return <Home initialPosts={data} />;
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const res = await postApis.getPosts();
    return { props: { data: res }, revalidate: 3600 };
  } catch (e) {
    console.error(e);
    return {
      notFound: true
    };
  }
};
