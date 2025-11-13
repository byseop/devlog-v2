import { useQuery } from '@tanstack/react-query';
import { categoryApis } from '@core/apis/category';

export const useGetCategory = () => {
  return useQuery({
    queryKey: ['select-category-list'],
    queryFn: () => categoryApis.getCategory()
  });
};
