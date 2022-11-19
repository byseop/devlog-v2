import dynamic from 'next/dynamic';
import { NotionRenderer } from 'react-notion-x';
import useRootState from '../../core/hooks/useRootState';
import Image from 'next/image';
import { useGetPost } from '../../core/queries/posts';
import Comment from '../Comment';
import Link from 'next/link';
import { customMapImageUrl } from '../../core/utils/notion-client/customImageMap';

import type { ExtendedRecordMap } from 'notion-types';
import type {
  PageObjectResponse,
  RichTextItemResponse
} from '@notionhq/client/build/src/api-endpoints';
import type { Response } from '../../interfaces';

interface IPostProps {
  className?: string;
  id: string;
  data: Response<{
    notionPage: ExtendedRecordMap;
    post: PageObjectResponse;
  }>;
}

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then((m) => m.Code)
);

const Post: React.FC<IPostProps> = ({ id, data, className }) => {
  const { mode } = useRootState((state) => state.theme);

  const { data: postData } = useGetPost(id, {
    initialData: data
  });

  const cover = postData?.data.post.cover as {
    type: 'external';
    external: {
      url: TextRequest;
    };
  };

  const title = postData?.data.post.properties.title as {
    type: 'title';
    title: Array<RichTextItemResponse>;
    id: string;
  };
  const subTitle = postData?.data.post.properties.subTitle as {
    type: 'rich_text';
    rich_text: Array<RichTextItemResponse>;
    id: string;
  };

  const linkMapper = (pageId: string) => `@${pageId}`;

  return (
    <div className={`post-wrapper ${className}`}>
      <div className="article-header">
        {cover && (
          <div className="cover-wrap">
            <div className="cover">
              <Image src={cover.external.url} alt="" fill />
            </div>
          </div>
        )}
        {title && (
          <div className="post-title-wrap">
            <h1>{title.title[0].plain_text}</h1>
            {subTitle && <h2>{subTitle.rich_text[0].plain_text}</h2>}
          </div>
        )}
      </div>
      {postData?.data.notionPage && (
        <div className="post-content-wrap">
          <NotionRenderer
            recordMap={postData.data.notionPage}
            darkMode={mode === 'dark'}
            components={{ Code, nextLink: Link, nextImage: Image }}
            mapPageUrl={linkMapper}
            mapImageUrl={customMapImageUrl}
          />
        </div>
      )}

      <Comment />
    </div>
  );
};

export default Post;
