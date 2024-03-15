import { Client } from '@notionhq/client';
import { NotionAPI } from 'notion-client';

import type { IAPIError, Response } from '@interfaces/index';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { ExtendedRecordMap } from 'notion-types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | Response<{
        notionPage: ExtendedRecordMap;
        post: PageObjectResponse;
      }>
    | IAPIError
  >
) {
  const page_id = req.query.id as string;
  const auth = process.env.NOTION_API_KEY;
  const activeUser = process.env.NOTION_USER_ID;
  const authToken = process.env.NOTION_AUTH_TOKEN;

  if (!page_id) {
    res.status(400).json({
      message: 'PAGE_ID 가 존재하지 않습니다.'
    });
    return;
  }

  if (!auth || !activeUser || !authToken) {
    res.status(401).json({ message: '인증 실패' });
    return;
  }

  const notionRenderClient = new NotionAPI({
    activeUser,
    authToken
  });

  const notion = new Client({
    auth
  });

  (async () => {
    try {
      if (req.method === 'GET') {
        const response = (await notion.pages.retrieve({
          page_id
        })) as PageObjectResponse;
        const notionPage = await notionRenderClient.getPage(page_id);

        const data = {
          notionPage,
          post: response
        };

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
