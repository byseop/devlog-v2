import { memo, useEffect, useState } from 'react';
import { useGetPosts } from '../../core/queries/posts';
import PostCard from '../PostCard';
import { useInView } from 'react-intersection-observer';

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
        {!isFetching &&
          data?.data.map((post, index) => (
            <li>
              <PostCard data={post} key={post.id + index} />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default memo(Posts);
