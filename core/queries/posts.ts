import { useQuery, UseQueryOptions, useQueryClient } from 'react-query';
import { postApis } from '../apis/posts';

import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { Response } from '../../interfaces';
import type { ExtendedRecordMap } from 'notion-types';
import { IPostsParams } from '../../interfaces/posts';

export const postsQueryKey = {
  posts: (params: IPostsParams) =>
    [
      'posts',
      JSON.parse(params.filter).query,
      ...JSON.parse(params.filter).categories
    ] as const,
  post: (id: string) => ['post', id] as const
};

export const useGetPosts = (
  params: IPostsParams,
  options?: UseQueryOptions<Response<PageObjectResponse[]>>
) => {
  return useQuery(
    postsQueryKey.posts(params),
    () => postApis.getPosts(params),
    {
      ...(options as any)
    }
  );
};

export const useGetPost = (
  id: string,
  options?: UseQueryOptions<
    Response<{
      notionPage: ExtendedRecordMap;
      post: PageObjectResponse;
    }>
  >
) => {
  return useQuery(postsQueryKey.post(id), () => postApis.getPost(id), {
    ...(options as any),
    enabled: false
  });
};
