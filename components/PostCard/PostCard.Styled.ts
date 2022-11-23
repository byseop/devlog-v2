import styled, { css } from 'styled-components';
import PostCard from './PostCard.Contents';

export const style = css`
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
      line-height: 1.1em;
    }

    .sub-title {
      margin-top: 1.4rem;
      font-size: 1.7rem;
      color: var(--text2);
      line-height: 1.4em;
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
        padding: 6px;
        font-size: 1.2rem;
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

  @media screen and (max-width: 700px) {
    flex-direction: column;
    height: auto;
    gap: 20px;

    .cover {
      width: 100%;
      height: 200px;
      position: relative;

      img {
        height: auto !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
      }
    }

    .card-contents {
      .title {
        font-size: 2.6rem;
      }
      .sub-title {
        font-size: 1.6rem;
        margin-top: 1rem;
      }
      .publish-date {
        font-size: 1.4rem;
        margin-top: 0.9rem;
      }
    }
  }
`;

const S = styled(PostCard)`
  ${style}
`;

export default S;
