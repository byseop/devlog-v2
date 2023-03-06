import { useState, useCallback } from 'react';
import Posts from '../Posts';
import CategoryFilter from '../CategoryFilter';
import TextFilter from '../TextFilter';

import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { Response } from '../../interfaces';

interface IHomeProps {
  className?: string;
  initialPosts: Response<PageObjectResponse[]>;
}

const Home: React.FC<IHomeProps> = ({ className, initialPosts }) => {
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [enteredText, setEnteredText] = useState<string>('');

  const handleChangeFilter = useCallback((value: string) => {
    setSelectedCategory((prev) =>
      prev.find((v) => v === value)
        ? prev.filter((v) => v !== value)
        : prev.concat(value)
    );
  }, []);

  const handleSubmitTextFilter = useCallback((value: string) => {
    setEnteredText(value);
  }, []);

  return (
    <div className={`contents ${className}`}>
      <div className="title-wrap">
        <h2>포스트</h2>
        <div className="actions">
          <TextFilter
            onSubmit={handleSubmitTextFilter}
            enteredText={enteredText}
          />
          <CategoryFilter
            onChange={handleChangeFilter}
            value={selectedCategory}
          />
        </div>
      </div>

      <Posts
        initialPosts={initialPosts}
        selectedCategory={selectedCategory}
        enteredText={enteredText}
      />
    </div>
  );
};

export default Home;
