import { postApis } from '@core/apis/post';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export const postQueryKey = {
  getAdditionalInfo: (id: string) => ['additionalInfo', id] as const,
  updateLike: (id: string) => ['updateLike', id] as const
};

export const useGetAdditionalInfo = (id: string) => {
  return useQuery(postQueryKey.getAdditionalInfo(id), () =>
    postApis.getAdditionalInfo(id)
  );
};

export const useUpdateLike = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    postQueryKey.updateLike(id),
    () => postApis.updateLike(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(postQueryKey.getAdditionalInfo(id));
      }
    }
  );
};
