import styled from 'styled-components';
import LikeButton from './Likebutton';

const S = styled(LikeButton)`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: none;
  color: var(--text1);
  outline: none;
  padding: 0;
  margin: 0;
  border: none;
  font-size: 1.6rem;

  .like-icon {
    font-size: 2.5rem;
    transform: translateY(-2px);
  }
`;

export default S;
