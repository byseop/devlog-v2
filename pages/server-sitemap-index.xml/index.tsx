import { getServerSideSitemapIndex } from 'next-sitemap';
import { postApis } from '@core/apis/posts';

import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const res = await postApis.getPosts();
    return getServerSideSitemapIndex(
      context,
      res.data.map((page) => `https://byseop.com/posts/@${page.id}`)
    );
  } catch (e) {
    console.error(e);
    return {
      notFound: true
    };
  }
};

export default function SitemapIndex() {}
