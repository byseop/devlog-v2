import { Client } from '@notionhq/client';
import { DEFINED_FILTER } from './constant';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { IAPIError, Response } from '../../interfaces';
import type {
  PageObjectResponse,
  QueryDatabaseParameters
} from '@notionhq/client/build/src/api-endpoints';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response<PageObjectResponse[]> | IAPIError>
) {
  const database_id = process.env.NOTION_DATABASE_ID;
  const auth = process.env.NOTION_API_KEY;
  const isProduction = process.env.APP_ENV === 'production';

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

  (async () => {
    try {
      if (req.method === 'GET') {
        const { query } = req;
        const filter: QueryDatabaseParameters['filter'] = {
          and: []
        };

        if (isProduction) {
          filter.and.push(DEFINED_FILTER.STATUS_PUBLISHED);
        }

        const response = await notion.databases.query({
          database_id,
          filter,
          sorts: [
            {
              property: 'publishDate',
              direction: 'descending'
            }
          ]
        });

        const data = response.results as PageObjectResponse[];

        res.status(200).json({
          data,
          status: 'ok',
          error: null
        });
      } else {
        res.status(405).json({});
        return;
      }
    } catch (e) {
      const error = e as any;
      const { status, body } = error;
      res.status(status).json(JSON.parse(body));
    }
  })();
}
