import { request } from './';

export const categoryApis = {
  getCategory: () =>
    request<any>({
      url: '/category',
      method: 'GET'
    })
};
