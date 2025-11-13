import { Client } from '@notionhq/client';
import { NotionAPI } from 'notion-client';
import { createApiSuccessResponse } from '@core/utils';
import { NextRequest, NextResponse } from 'next/server';

import type { IAPIError, Response } from '@interfaces/index';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { ExtendedRecordMap } from 'notion-types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page_id = searchParams.get('id');
  const auth = process.env.NOTION_API_KEY;
  const activeUser = process.env.NOTION_USER_ID;
  const authToken = process.env.NOTION_AUTH_TOKEN;

  if (!page_id) {
    return NextResponse.json<IAPIError>(
      {
        message: 'PAGE_ID 가 존재하지 않습니다.'
      },
      { status: 400 }
    );
  }

  if (!auth || !activeUser || !authToken) {
    return NextResponse.json<IAPIError>(
      { message: '인증 실패' },
      { status: 401 }
    );
  }

  const notionRenderClient = new NotionAPI({
    activeUser,
    authToken
  });

  const notion = new Client({
    auth
  });

  try {
    // Remove @ prefix if present
    const cleanPageId = page_id.startsWith('@') ? page_id.slice(1) : page_id;

    const response = (await notion.pages.retrieve({
      page_id: cleanPageId
    })) as PageObjectResponse;
    const notionPage = await notionRenderClient.getPage(cleanPageId);

    const data = {
      notionPage,
      post: response
    };

    return NextResponse.json<
      Response<{
        notionPage: ExtendedRecordMap;
        post: PageObjectResponse;
      }>
    >(createApiSuccessResponse(data));
  } catch (e) {
    const error = e as any;
    const { body } = error;
    const { status } = body;

    return NextResponse.json(JSON.parse(body), { status: status || 500 });
  }
}
