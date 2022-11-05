import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { postApis } from '../apis/posts';

import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { Response } from '../../interfaces';

export const postsQueryKey = {
  posts: () => ['posts'] as const,
  post: (id: string) => ['post', id] as const
};

export const useGetPosts = (
  options?: UseQueryOptions<Response<PageObjectResponse[]>>
) => {
  return useQuery(
    postsQueryKey.posts(),
    () => postApis.getPosts(),
    options as any
  );
};

export const useGetPost = (
  id: string,
  options?: UseQueryOptions<Response<PageObjectResponse[]>>
) => {
  return useQuery(
    postsQueryKey.post(id),
    () => postApis.getPost(id),
    options as any
  );
};
