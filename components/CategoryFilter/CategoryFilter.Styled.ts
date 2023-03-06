import styled from 'styled-components';
import CategoryFilter from './CategoryFilter';

const S = styled(CategoryFilter)`
  position: relative;
  color: var(--text1);
  z-index: 999;
  .icon-arrow {
    fill: var(--bg-element1);
  }
  .btn-filter {
    display: flex;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    background: none;
    border: none;
    color: var(--text1);
    font-size: 2.4rem;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.2s ease-out;
    position: relative;
    padding: 0;
    align-items: center;
    justify-content: center;

    &:hover {
      opacity: 1;
      background: var(--slight-layer);
    }

    /* svg {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    } */

    .point {
      position: absolute;
      right: 7px;
      top: 7px;
      width: 4px;
      height: 4px;
      border-radius: 100%;
      background: red;
    }
  }

  .btn-close {
    background: none;
    border: none;
    color: var(--text1);
    cursor: pointer;
    font-size: 1.5rem;
    position: absolute;
    top: 7px;
    right: 7px;
  }

  .category-content-wrap {
    max-width: 400px;
    box-sizing: border-box;
    padding: 2rem 3rem 2rem 2rem;
    background: var(--bg-element1);
    border-radius: 14px;
    box-shadow: rgb(0 0 33 / 7%) 0px 16px 22.4px 4.8px,
      rgb(0 0 33 / 5%) 0px 3.2px 16px 0px, rgb(0 0 33 / 7%) 0px 0px 1px 0px;
    .category-list {
      p {
        font-size: 1.5rem;
      }
      ul {
        margin-top: 1.5rem;
        display: flex;
        gap: 10px;
        font-size: 1.2rem;
        flex-wrap: wrap;
        li {
          cursor: pointer;
          padding: 6px;
          color: var(--text2);
          border: 1px solid var(--text3);
          border-radius: 4px;
          transition: all 0.2s ease-out;

          &.selected {
            color: #fff;
          }
        }
      }
    }
  }
`;

export default S;
