import { Client } from '@notionhq/client';
import { DEFINED_FILTER } from './constant';
import { createApiSuccessResponse } from '@pages/api/utils';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { IAPIError, Response } from '@interfaces/index';
import type {
  PageObjectResponse,
  QueryDatabaseParameters
} from '@notionhq/client/build/src/api-endpoints';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response<PageObjectResponse[]> | IAPIError>
) {
  const database_id = process.env.NOTION_DATABASE_ID;
  const auth = process.env.NOTION_API_KEY;
  const isProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production';

  if (!database_id) {
    res.status(400).json({
      message: 'NOTION_DATABASE_ID 가 존재하지 않습니다.'
    });
    return;
  }

  if (!auth) {
    res.status(401).json({
      message: 'NOTION_API_KEY 가 존재하지 않습니다.'
    });
    return;
  }

  const notion = new Client({
    auth
  });

  try {
    if (req.method === 'GET') {
      const { query } = req;
      const filter: QueryDatabaseParameters['filter'] = {
        and: []
      };

      if (isProduction) {
        filter.and.push(DEFINED_FILTER.STATUS_PUBLISHED);
      }

      if (query.filter) {
        const paramsFilter = JSON.parse(query.filter as string);
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
        page_size: (query.pageSize as number | undefined) || 20
      });

      const data = response.results as PageObjectResponse[];

      res.status(200).json(createApiSuccessResponse(data));

      return;
    }

    res.status(405).json({});

    return;
  } catch (e) {
    const error = e as any;
    const { body } = error;
    const { status } = body;

    res.status(status || 500).json(JSON.parse(body));

    return;
  }
}
