import { memo, Suspense } from 'react';
import { useGetPosts } from '../../core/queries/posts';
import CustomSuspense from '../CustomSuspense';
import * as PostCard from '../PostCard';

import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { Response } from '../../interfaces';
import { QueryErrorResetBoundary } from 'react-query';
import useMounted from '../../core/hooks/useMounted';

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
  return (
    <div className={`posts-wrapper ${className}`}>
      <QueryErrorResetBoundary>
        <CustomSuspense
          fallback={
            <ul>
              <li>
                <PostCard.Skeleton />
              </li>
              <li>
                <PostCard.Skeleton />
              </li>
              <li>
                <PostCard.Skeleton />
              </li>
            </ul>
          }
        >
          <PostList
            initialPosts={initialPosts}
            selectedCategory={selectedCategory}
          />
        </CustomSuspense>
      </QueryErrorResetBoundary>
    </div>
  );
};

export default memo(Posts);

const PostList: React.FC<IPostsProps> = ({
  initialPosts,
  selectedCategory
}) => {
  const mounted = useMounted();
  const { data } = useGetPosts(
    {
      filter: JSON.stringify({ categories: selectedCategory })
    },
    {
      suspense: true,
      useErrorBoundary: true,
      initialData: !mounted ? initialPosts : undefined
    }
  );

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
