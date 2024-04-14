import { request } from '@core/apis';
import { IPostAdditionalInfoResponse } from '@interfaces/post';

export const postApis = {
  getAdditionalInfo: (id: string) =>
    request<IPostAdditionalInfoResponse>({
      url: '/post/additional-info',
      method: 'GET',
      params: {
        id
      }
    })
};
