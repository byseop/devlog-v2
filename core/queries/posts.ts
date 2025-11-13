import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { postApis } from '@core/apis/posts';

import type { PageObjectResponse } from '@notionhq/client/build/src';
import type { Response } from '@interfaces/index';
import type { ExtendedRecordMap } from 'notion-types';
import { IPostsParams } from '@interfaces/posts';
import type { UndefinedInitialDataOptions, UseSuspenseQueryOptions } from '@tanstack/react-query';

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
  options?: Partial<UseSuspenseQueryOptions<Response<PageObjectResponse[]>>>
) => {
  return useSuspenseQuery({
    queryKey: postsQueryKey.posts(params),
    queryFn: () => postApis.getPosts(params),
    ...options
  });
};

export const useGetPost = (
  id: string,
  options?: Partial<
    UndefinedInitialDataOptions<
      Response<{
        notionPage: ExtendedRecordMap;
        post: PageObjectResponse;
      }>
    >
  >
) => {
  return useQuery({
    queryKey: postsQueryKey.post(id),
    queryFn: () => postApis.getPost(id),
    enabled: false,
    ...options
  });
};
