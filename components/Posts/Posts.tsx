import { memo } from 'react';
import { useGetPosts } from '../../core/queries/posts';
import PostCard from '../PostCard';

import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { Response } from '../../interfaces';

interface IPostsProps {
  className?: string;
  initialPosts: Response<PageObjectResponse[]>;
}

const Posts: React.FC<IPostsProps> = ({ initialPosts, className }) => {
  const { data } = useGetPosts({
    initialData: initialPosts
  });

  return (
    <div className={`posts-wrapper ${className}`}>
      <ul>
        {data?.data.map((post) => (
          <PostCard data={post} key={post.id} />
        ))}
      </ul>
    </div>
  );
};

export default memo(Posts);
