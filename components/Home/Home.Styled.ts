import styled from 'styled-components';
import Home from './Home';

const S = styled(Home)`
  .title-wrap {
    margin: 52px 0 32px 0;
    font-size: 3.6rem;
    color: ${(props) => props.theme.light.text1};
  }
`;

export default S;
