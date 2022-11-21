import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import { style } from './PostCard.Styled';

interface IProps {
  className?: string;
}

const PostCardSkeleton: React.FC<IProps> = ({ className }) => {
  return (
    <a>
      <div className={`post-card ${className}`} style={{ zIndex: -1 }}>
        <div className="cover">
          <Skeleton height="100%" />
        </div>
        <div className="card-contents">
          <div className="categories">
            <Skeleton width={50} style={{ padding: 0, height: 24 }} />
            <Skeleton width={45} style={{ padding: 0, height: 24 }} />
          </div>
          <div className="title">
            <p>
              <Skeleton />
            </p>
          </div>
          <div className="sub-title">
            <p>
              <Skeleton count={3} />
            </p>
          </div>
          <div className="publish-date">
            <span>
              <Skeleton width={78} />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default styled(PostCardSkeleton)`
  ${style}
`;
