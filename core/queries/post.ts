import { postApis } from '@core/apis/post';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const postQueryKey = {
  getAdditionalInfo: (id: string) => ['additionalInfo', id] as const,
  updateLike: (id: string) => ['updateLike', id] as const
};

export const useGetAdditionalInfo = (id: string) => {
  return useQuery({
    queryKey: postQueryKey.getAdditionalInfo(id),
    queryFn: () => postApis.getAdditionalInfo(id)
  });
};

export const useUpdateLike = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: postQueryKey.updateLike(id),
    mutationFn: () => postApis.updateLike(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postQueryKey.getAdditionalInfo(id)
      });
    }
  });
};
