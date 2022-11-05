import { Client } from '@notionhq/client';
import type { IAPIError, Response } from '../../interfaces';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response<{}> | IAPIError>
) {
  const page_id = req.query.id as string;
  const auth = process.env.NOTION_API_KEY;

  if (!page_id) {
    res.status(400).json({
      message: 'PAGE_ID 가 존재하지 않습니다.'
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
        const response = (await notion.pages.retrieve({
          page_id
        })) as PageObjectResponse;

        const data = response;

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
