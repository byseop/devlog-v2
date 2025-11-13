import { request } from '@core/apis';
import { createApiSuccessResponse } from '@core/utils';
import { NextRequest, NextResponse } from 'next/server';

import type { IAPIError, Response } from '@interfaces/index';
import {
  type ILikeResponse,
  type IPostAdditionalInfoResponse
} from '@interfaces/post';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const pageId = searchParams.get('id');

  if (!pageId) {
    return NextResponse.json<IAPIError>(
      {
        message: 'PAGE_ID 가 존재하지 않습니다.'
      },
      { status: 400 }
    );
  }

  try {
    const likeRes = await request<ILikeResponse>({
      url: `/post/like`,
      method: 'GET',
      params: {
        id: pageId
      }
    });

    return NextResponse.json<Response<IPostAdditionalInfoResponse>>(
      createApiSuccessResponse({
        like: likeRes.data
      })
    );
  } catch (e) {
    const error = e as any;
    const { body } = error;
    const { status } = body;

    return NextResponse.json(JSON.parse(body), { status: status || 500 });
  }
}
