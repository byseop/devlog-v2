import { postApis } from '@core/apis/post';
import { useQuery } from 'react-query';

export const postQueryKey = {
  getAdditionalInfo: (id: string) => ['additionalInfo', id] as const
};

export const useGetAdditionalInfo = (id: string) => {
  return useQuery(postQueryKey.getAdditionalInfo(id), () =>
    postApis.getAdditionalInfo(id)
  );
};
