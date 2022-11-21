import { memo } from 'react';
import { useGetPosts } from '../../core/queries/posts';
import * as PostCard from '../PostCard';

import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { Response } from '../../interfaces';

interface IPostsProps {
  className?: string;
  initialPosts: Response<PageObjectResponse[]>;
  selectedCategory: string[];
}

const Posts: React.FC<IPostsProps> = ({
  initialPosts,
  className,
  selectedCategory
}) => {
  const { data, isFetching } = useGetPosts(
    {
      filter: JSON.stringify({ categories: selectedCategory })
    },
    {
      initialData: initialPosts
    }
  );

  return (
    <div className={`posts-wrapper ${className}`}>
      <ul>
        {isFetching && (
          <>
            <li>
              <PostCard.Skeleton />
            </li>
            <li>
              <PostCard.Skeleton />
            </li>
            <li>
              <PostCard.Skeleton />
            </li>
          </>
        )}

        {!isFetching &&
          data?.data.map((post, index) => (
            <li key={post.id + index}>
              <PostCard.Contents data={post} />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default memo(Posts);
