import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { request } from './';

export const postApis = {
  getPosts: (params = {}) =>
    request<PageObjectResponse[]>({
      url: '/posts',
      method: 'GET',
      params
    }),

  getPost: (id: string) =>
    request<PageObjectResponse>({
      url: '/post',
      method: 'GET',
      params: {
        id
      }
    })
};
