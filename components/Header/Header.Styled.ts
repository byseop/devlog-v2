import styled from 'styled-components';
import Header from './Header';

const S = styled(Header)`
  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 980px;
    width: 100%;
    margin: auto;
    padding: 2rem;

    .logo {
      font-size: 3rem;
      a {
        text-decoration: none;
        color: var(--text1);
        letter-spacing: -0.15rem;
      }
    }

    .actions {
      display: flex;
      gap: 1.5rem;

      .btn-wrap {
        button,
        a {
          display: block;
          position: relative;
          width: 40px;
          height: 40px;
          padding: 0;
          border-radius: 100%;
          border: none;
          background-color: transparent;
          color: var(--text1);
          font-size: 2.5rem;
          cursor: pointer;
          outline: none;
          transition: background-color 0.2s ease-out;

          &:hover {
            background-color: var(--slight-layer);
          }

          span {
            position: absolute;
            transform-origin: center center;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            display: block;
            width: 25px;
            height: 25px;
            line-height: 100%;
          }
        }
      }
    }
  }
`;

export default S;
