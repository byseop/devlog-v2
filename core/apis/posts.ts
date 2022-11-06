import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { request } from './';

import type { ExtendedRecordMap } from 'notion-types';

export const postApis = {
  getPosts: (params = {}) =>
    request<PageObjectResponse[]>({
      url: '/posts',
      method: 'GET',
      params
    }),

  getPost: (id: string) =>
    request<{
      notionPage: ExtendedRecordMap;
      post: PageObjectResponse;
    }>({
      url: '/post',
      method: 'GET',
      params: {
        id
      }
    })
};
