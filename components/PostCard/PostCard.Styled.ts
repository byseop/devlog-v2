import styled from 'styled-components';
import PostCard from './PostCard';

const S = styled(PostCard)`
  display: flex;
  height: 240px;
  gap: 48px;

  .cover {
    width: 240px;
    height: 240px;
    border-radius: 14px;
    position: relative;
    overflow: hidden;
    transition: all 0.2s ease-out;
  }

  .card-contents {
    position: relative;
    color: var(--text1);
    flex: 1;
    .title {
      font-size: 3.6rem;
      margin-top: 1rem;
      transition: color 0.2s ease-out;
    }

    .sub-title {
      margin-top: 1.4rem;
      font-size: 1.7rem;
      color: var(--text2);
    }

    .publish-date {
      margin-top: 1.2rem;
      font-size: 1.5rem;
      color: var(--text3);
    }

    .categories {
      display: flex;
      gap: 8px;

      span {
        border-radius: 4px;
        color: #fff;
        padding: 4px;
      }
    }
  }

  &:hover {
    .cover {
      box-shadow: rgb(0 0 33 / 7%) 0px 16px 22.4px 4.8px,
        rgb(0 0 33 / 5%) 0px 3.2px 16px 0px, rgb(0 0 33 / 7%) 0px 0px 1px 0px;
      transform: translate3D(0, -3%, 0);
    }

    .title {
      color: var(--primary1);
    }
  }
`;

export default S;
