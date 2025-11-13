import { Client } from '@notionhq/client';
import { NotionAPI } from 'notion-client';
import { DEFINED_FILTER } from '@core/constants';

import type {
  PageObjectResponse,
  QueryDatabaseParameters
} from '@notionhq/client/build/src/api-endpoints';
import type { ExtendedRecordMap } from 'notion-types';

const database_id = process.env.NOTION_DATABASE_ID!;
const auth = process.env.NOTION_API_KEY!;
const activeUser = process.env.NOTION_USER_ID!;
const authToken = process.env.NOTION_AUTH_TOKEN!;
const isProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production';

const notion = new Client({ auth });
const notionRenderClient = new NotionAPI({ activeUser, authToken });

export async function getNotionPosts(): Promise<PageObjectResponse[]> {
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
    ],
    page_size: 20
  });

  return response.results as PageObjectResponse[];
}

export async function getNotionPost(page_id: string): Promise<{
  notionPage: ExtendedRecordMap;
  post: PageObjectResponse;
}> {
  const response = (await notion.pages.retrieve({
    page_id
  })) as PageObjectResponse;
  const notionPage = await notionRenderClient.getPage(page_id);

  return {
    notionPage,
    post: response
  };
}
