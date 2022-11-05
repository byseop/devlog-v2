import Posts from '../Posts';

import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { Response } from '../../interfaces';

interface IHomeProps {
  className?: string;
  initialPosts: Response<PageObjectResponse[]>;
}

const Home: React.FC<IHomeProps> = ({ className, initialPosts }) => {
  return (
    <div className={`contents ${className}`}>
      <div className="title-wrap">
        <h2>포스트</h2>
      </div>

      <Posts initialPosts={initialPosts} />
    </div>
  );
};

export default Home;
