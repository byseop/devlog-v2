import { Client } from '@notionhq/client';
import { createApiSuccessResponse } from '@pages/api/utils';

import type { IAPIError, Response } from '@interfaces/index';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
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

  try {
    if (req.method === 'GET') {
      const response = await notion.databases.retrieve({
        database_id: database_id
      });

      const data = (
        response.properties
          .category as MultiSelectDatabasePropertyConfigResponse
      ).multi_select.options;

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
