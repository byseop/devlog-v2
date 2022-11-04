import styled from 'styled-components';
import Header from './Header';

const S = styled(Header)`
  .header-inner {
    max-width: 980px;
    width: 100%;
    margin: auto;
    padding: 2rem;
  }
  .logo {
    font-size: 3rem;
  }
`;

export default S;
