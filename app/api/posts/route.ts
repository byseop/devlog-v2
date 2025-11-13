import { Client } from '@notionhq/client';
import { DEFINED_FILTER } from '@core/constants';
import { createApiSuccessResponse } from '@core/utils';
import { NextRequest, NextResponse } from 'next/server';

import type { IAPIError, Response } from '@interfaces/index';
import type {
  PageObjectResponse,
  QueryDatabaseParameters
} from '@notionhq/client/build/src/api-endpoints';

export async function GET(request: NextRequest) {
  const database_id = process.env.NOTION_DATABASE_ID;
  const auth = process.env.NOTION_API_KEY;
  const isProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production';

  if (!database_id) {
    return NextResponse.json<IAPIError>(
      {
        message: 'NOTION_DATABASE_ID 가 존재하지 않습니다.'
      },
      { status: 400 }
    );
  }

  if (!auth) {
    return NextResponse.json<IAPIError>(
      {
        message: 'NOTION_API_KEY 가 존재하지 않습니다.'
      },
      { status: 401 }
    );
  }

  const notion = new Client({
    auth
  });

  try {
    const searchParams = request.nextUrl.searchParams;
    const filterParam = searchParams.get('filter');
    const pageSize = searchParams.get('pageSize');

    const filter: QueryDatabaseParameters['filter'] = {
      and: []
    };

    if (isProduction) {
      filter.and.push(DEFINED_FILTER.STATUS_PUBLISHED);
    }

    if (filterParam) {
      const paramsFilter = JSON.parse(filterParam);
      if (paramsFilter.categories) {
        paramsFilter.categories.forEach((category: string) => {
          filter.and.push(DEFINED_FILTER.MULTI_SELECT_CATEGORY(category));
        });
      }

      if (paramsFilter.query) {
        const query = paramsFilter.query as string;
        filter.and.push({
          or: [
            DEFINED_FILTER.TITLE_CONTAINED(query),
            DEFINED_FILTER.RICH_TEXT_CONTAINED(query)
          ]
        });
      }
    }

    const response = await notion.databases.query({
      database_id,
      filter,
      sorts: [
        {
          property: 'publishDate',
          direction: 'descending'
        }
      ],
      page_size: pageSize ? parseInt(pageSize) : 20
    });

    const data = response.results as PageObjectResponse[];

    return NextResponse.json<Response<PageObjectResponse[]>>(
      createApiSuccessResponse(data)
    );
  } catch (e) {
    const error = e as any;
    const { body } = error;
    const { status } = body;

    return NextResponse.json(JSON.parse(body), { status: status || 500 });
  }
}
