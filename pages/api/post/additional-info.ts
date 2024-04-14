import { request } from '@core/apis';

import type { IAPIError, Response } from '@interfaces/index';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  type ILikeResponse,
  type IPostAdditionalInfoResponse
} from '@interfaces/post';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response<IPostAdditionalInfoResponse> | IAPIError>
) {
  const pageId = req.query.id as string;

  if (!pageId) {
    res.status(400).json({
      message: 'PAGE_ID 가 존재하지 않습니다.'
    });
    return;
  }

  try {
    if (req.method === 'GET') {
      const likeRes = await request<ILikeResponse>({
        url: `/post/like`,
        method: 'GET',
        params: {
          id: pageId
        }
      });

      return res.status(200).json({
        data: {
          like: likeRes.data
        },
        status: 'ok',
        error: null
      });

      return;
    }

    res.status(405).json({});

    return;
  } catch (e) {
    console.log('eeee', e);
    const error = e as any;
    const { body } = error;
    const { status } = body;

    res.status(status || 500).json(JSON.parse(body));

    return;
  }
}
