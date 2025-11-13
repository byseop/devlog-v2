import { memo } from 'react';
import { useGetPosts } from '@core/queries/posts';
import CustomSuspense from '@components/CustomSuspense';
import * as PostCard from '@components/PostCard';

import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { Response } from '@interfaces/index';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import useMounted from '@core/hooks/useMounted';

interface IPostsProps {
  className?: string;
  initialPosts: Response<PageObjectResponse[]>;
  selectedCategory: string[];
  enteredText: string;
}

const Posts: React.FC<IPostsProps> = ({
  className,
  initialPosts,
  selectedCategory,
  enteredText
}) => {
  return (
    <div className={`posts-wrapper ${className}`}>
      <QueryErrorResetBoundary>
        {() => (
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
              enteredText={enteredText}
            />
          </CustomSuspense>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
};

export default memo(Posts);

const PostList: React.FC<IPostsProps> = ({
  initialPosts,
  selectedCategory,
  enteredText
}) => {
  const mounted = useMounted();
  const { data } = useGetPosts(
    {
      filter: JSON.stringify({
        categories: selectedCategory,
        query: enteredText
      })
    },
    {
      initialData: !mounted ? initialPosts : undefined
    }
  );

  return (
    <ul>
      {data.data.map((post) => (
        <li key={post.id}>
          <PostCard.Contents data={post} />
        </li>
      ))}
    </ul>
  );
};
