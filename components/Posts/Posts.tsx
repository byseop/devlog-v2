import { memo, useEffect, useState } from 'react';
import { useGetPosts } from '../../core/queries/posts';
import PostCard from '../PostCard';
import { useInView } from 'react-intersection-observer';

import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { Response } from '../../interfaces';

interface IPostsProps {
  className?: string;
  initialPosts: Response<PageObjectResponse[]>;
}

const Posts: React.FC<IPostsProps> = ({ initialPosts, className }) => {
  const [posts, setPosts] = useState<PageObjectResponse[]>(initialPosts.data);
  const [end, setEnd] = useState<boolean>(false);
  const [cursor, setCurosr] = useState<string>(
    initialPosts.data[initialPosts.data.length - 1].id
  );
  const { refetch: fetchNext, isLoading } = useGetPosts(
    {
      cursor
    },
    {
      initialData: initialPosts,
      onSuccess: (res) => {
        if (res.data.length === 1) {
          setEnd(true);
          return;
        }
        setPosts((prev) => [...prev, ...res.data.slice(1)]);
        setCurosr(res.data[res.data.length - 1]?.id);
      }
    }
  );

  const { ref, inView } = useInView({
    threshold: 1
  });

  useEffect(() => {
    if (inView && cursor && !end) {
      fetchNext();
    }
  }, [inView, end]);

  return (
    <div className={`posts-wrapper ${className}`}>
      <ul>
        {posts.map((post, index) => (
          <PostCard
            data={post}
            key={post.id + index}
            lastRef={(index === posts.length - 1 && ref) || undefined}
          />
        ))}
      </ul>
    </div>
  );
};

export default memo(Posts);
