import { Client } from '@notionhq/client';
import { NotionAPI } from 'notion-client';

import type { IAPIError, Response } from '@interfaces/index';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { ExtendedRecordMap } from 'notion-types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response<SelectPropertyResponse[]> | IAPIError>
) {
  const auth = process.env.NOTION_API_KEY;
  const database_id = process.env.NOTION_DATABASE_ID;

  if (!auth || !database_id) {
    res.status(401).json({ message: '인증 실패' });
    return;
  }

  const notion = new Client({
    auth
  });

  (async () => {
    try {
      if (req.method === 'GET') {
        const response = await notion.databases.retrieve({
          database_id
        });

        const data = (
          response.properties
            .category as MultiSelectDatabasePropertyConfigResponse
        ).multi_select.options;

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
