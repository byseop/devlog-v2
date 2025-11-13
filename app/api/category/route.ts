import { Client } from '@notionhq/client';
import { createApiSuccessResponse } from '@core/utils';
import { NextResponse } from 'next/server';

import type { IAPIError, Response } from '@interfaces/index';

export async function GET() {
  const auth = process.env.NOTION_API_KEY;
  const database_id = process.env.NOTION_DATABASE_ID;

  if (!auth || !database_id) {
    return NextResponse.json<IAPIError>(
      { message: '인증 실패' },
      { status: 401 }
    );
  }

  const notion = new Client({
    auth
  });

  try {
    const response = await notion.databases.retrieve({
      database_id: database_id
    });

    const data = (
      response.properties.category as MultiSelectDatabasePropertyConfigResponse
    ).multi_select.options;

    return NextResponse.json<Response<SelectPropertyResponse[]>>(
      createApiSuccessResponse(data)
    );
  } catch (e) {
    const error = e as any;
    const { body } = error;
    const { status } = body;

    return NextResponse.json(JSON.parse(body), { status: status || 500 });
  }
}
