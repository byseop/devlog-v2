import { request } from './';

import type { ICategory } from '../../interfaces/category';

export const categoryApis = {
  getCategory: () =>
    request<ICategory[]>({
      url: '/category',
      method: 'GET'
    })
};
