import { memo, Suspense, useEffect } from 'react';
import { useGetPosts, useGetPostsQueryClient } from '../../core/queries/posts';
import * as PostCard from '../PostCard';
import { ErrorBoundary } from 'react-error-boundary';

import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { Response } from '../../interfaces';

interface IPostsProps {
  className?: string;
  initialPosts: Response<PageObjectResponse[]>;
  selectedCategory: string[];
}

const Posts: React.FC<IPostsProps> = ({
  className,
  initialPosts,
  selectedCategory
}) => {
  const { prefetch } = useGetPostsQueryClient({
    filter: JSON.stringify({ categories: selectedCategory })
  });

  useEffect(() => {
    if (selectedCategory.length > 0) prefetch();
  }, [selectedCategory]);

  return (
    <div className={`posts-wrapper ${className}`}>
      <Suspense
        fallback={
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
        }
      >
        <PostList
          initialPosts={initialPosts}
          selectedCategory={selectedCategory}
        />
      </Suspense>
    </div>
  );
};

export default memo(Posts);

const PostList: React.FC<IPostsProps> = ({
  initialPosts,
  selectedCategory
}) => {
  const { data, status } = useGetPosts(
    {
      filter: JSON.stringify({ categories: selectedCategory })
    },
    {
      suspense: true,
      initialData: initialPosts
    }
  );
  console.log(status);
  return (
    <ul>
      {data?.data.map((post) => (
        <li key={post.id}>
          <PostCard.Contents data={post} />
        </li>
      ))}
    </ul>
  );
};
