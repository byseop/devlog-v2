import { useState, useCallback } from 'react';
import Posts from '../Posts';
import CategoryFilter from '../CategoryFilter';

import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { Response } from '../../interfaces';

interface IHomeProps {
  className?: string;
  initialPosts: Response<PageObjectResponse[]>;
}

const Home: React.FC<IHomeProps> = ({ className, initialPosts }) => {
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  const handleChangeFilter = useCallback((value: string) => {
    setSelectedCategory((prev) =>
      prev.find((v) => v === value)
        ? prev.filter((v) => v !== value)
        : prev.concat(value)
    );
  }, []);

  return (
    <div className={`contents ${className}`}>
      <div className="title-wrap">
        <h2>포스트</h2>
        <CategoryFilter
          onChange={handleChangeFilter}
          value={selectedCategory}
        />
      </div>

      <Posts initialPosts={initialPosts} />
    </div>
  );
};

export default Home;
