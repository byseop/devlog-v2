import styled from 'styled-components';
import Post from './Post';

const S = styled(Post)`
  /* max-width: 700px; */
  width: 100%;
  margin: auto;

  .article-header {
    .cover-wrap {
      height: 320px;
      position: relative;

      .cover {
        width: 100vw;
        height: 100%;
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
        overflow: hidden;

        img {
          top: 50% !important;
          transform: translateY(-50%) !important;
          height: auto !important;
        }
      }
    }

    .post-title-wrap {
      max-width: 688px;
      width: 100%;
      margin: 5rem auto;
      padding: 0 1.6rem;
      h1 {
        color: var(--text1);
        font-size: 4.8rem;
        font-weight: bold;
      }
      h2 {
        margin-top: 2rem;
        font-size: 2.4rem;
        color: var(--text2);
      }
    }
  }

  @media screen and (max-width: 700px) {
    .article-header {
      .post-title-wrap {
        margin: 6rem auto 3rem auto;
        h1 {
          font-size: 3rem;
        }

        h2 {
          font-size: 2rem;
        }
      }
    }
  }
`;

export default S;
