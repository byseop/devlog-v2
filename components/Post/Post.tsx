import dynamic from 'next/dynamic';
import { NotionRenderer } from 'react-notion-x';
import useRootState from '../../core/hooks/useRootState';

import type { ExtendedRecordMap } from 'notion-types';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { useGetPost } from '../../core/queries/posts';
import type { Response } from '../../interfaces';

interface IPostProps {
  className?: string;
  id: string;
  data: Response<{
    notionPage: ExtendedRecordMap;
    post: PageObjectResponse;
  }>;
}

const Post: React.FC<IPostProps> = ({ id, data, className }) => {
  const Code = dynamic(() =>
    import('react-notion-x/build/third-party/code').then((m) => m.Code)
  );
  const { mode } = useRootState((state) => state.theme);

  const { data: postData } = useGetPost(id, {
    initialData: data
  });

  return (
    <div className={`post-wrapper ${className}`}>
      {postData?.data.notionPage && (
        <NotionRenderer
          recordMap={postData.data.notionPage}
          darkMode={mode === 'dark'}
          components={{ Code }}
        />
      )}
    </div>
  );
};

export default Post;
