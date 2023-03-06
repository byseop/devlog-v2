import styled from 'styled-components';
import TextFilter from './TextFilter';

const S = styled(TextFilter)`
  .dialog-trigger-button {
    display: flex;
    width: 40px;
    height: 40px;
    background: none;
    font-size: 2rem;
    color: var(--text1);
    border: none;
    margin: 0;
    padding: 0;
    position: relative;
    opacity: 0.8;
    border-radius: 40px 40px 40px 40px;
    transition: opacity 0.2s ease-out;
    cursor: pointer;
    outline: none;
    align-items: center;
    justify-content: center;
    gap: 5px;

    /* svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    } */

    &:hover {
      opacity: 1;
      background: var(--slight-layer);
    }

    &[data-entered='true'] {
      width: auto;
      padding: 0 1rem;
    }

    .text-filter-clearance {
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
      width: 16px;
      height: 16px;
      color: var(--text2);
    }

    span {
      display: block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 300px;
    }
  }

  &.dialog-overlay {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: var(--opaque-layer);
    z-index: 1000;
  }

  &.text-filter-content {
    max-width: 800px;
    width: calc(100% - 4rem);
    position: fixed;
    left: 50%;
    top: 50%;
    padding: 1rem 2rem;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    background: var(--bg-element7);
    border-radius: 10px;
    z-index: 1001;
    box-shadow: rgb(0 0 33 / 7%) 0px 16px 22.4px 4.8px,
      rgb(0 0 33 / 5%) 0px 3.2px 16px 0px, rgb(0 0 33 / 7%) 0px 0px 1px 0px;

    .text-filter-input {
      input {
        display: block;
        width: 100%;
        height: 48px;
        color: var(--text1);
        border: none;
        margin: 0;
        padding: 0;
        background: transparent;
        outline: none;
        font-size: 2.4rem;
      }
    }
  }

  @media screen and (max-width: 700px) {
    .dialog-trigger-button {
      span {
        max-width: 130px;
      }
    }
  }
`;

export default S;
