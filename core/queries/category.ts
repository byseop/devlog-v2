import { useQuery } from 'react-query';
import { categoryApis } from '../apis/category';

export const useGetCategory = () => {
  return useQuery(['select-category-list'], () => categoryApis.getCategory());
};
