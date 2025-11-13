import { getServerSideSitemapIndexLegacy } from 'next-sitemap';
import { postApis } from '@core/apis/posts';

import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const res = await postApis.getPosts();
    return getServerSideSitemapIndexLegacy(
      ctx,
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
