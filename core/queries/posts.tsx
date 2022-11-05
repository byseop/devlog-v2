import { useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { postApis } from '../apis/posts';

import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { Response } from '../../interfaces';

export const postsQueryKey = {
  posts: () => ['posts'] as const
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
