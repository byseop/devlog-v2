import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { request } from './';

export const postApis = {
  getPosts: (params = {}) =>
    request<PageObjectResponse[]>({
      url: '/posts',
      method: 'GET',
      params
    })
};
