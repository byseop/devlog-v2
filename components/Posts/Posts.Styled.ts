'use client';

import styled from 'styled-components';
import Posts from './Posts';

const S = styled(Posts)`
  > ul {
    display: flex;
    flex-direction: column;
    gap: 8rem;
  }
`;

export default S;
