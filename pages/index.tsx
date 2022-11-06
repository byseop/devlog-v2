import Home from '../components/Home';
import { postApis } from '../core/apis/posts';
import Meta from '../components/Meta';

import type { Response } from '../interfaces';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export default function ({ data }: { data: Response<PageObjectResponse[]> }) {
  return (
    <>
      <Meta
        title="byseop.dev"
        description="프론트엔드 개발자 byseop 개발블로그 입니다. 세상에서 가장 빠르게 최신 개발 트렌드를 확인해보세요."
        url="https://byseop.dev"
      />
      <Home initialPosts={data} />
    </>
  );
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
