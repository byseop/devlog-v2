import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

import type { IStyleCode } from '@core/reducer/styleTheme';

const GlobalStyle = createGlobalStyle<{ mode: IStyleCode }>`
  ${reset}
  * {
    /* transition: color 0.2s ease-out; */
  }
  html {
    font-size: 10px;
    font-family: '-apple-system',
    'BlinkMacSystemFont',
    'Helvetica Neue',
    'Apple SD Gothic Neo',
    'Malgun Gothic',
    '맑은 고딕',
    '나눔고딕',
    'Nanum Gothic',
    'Noto Sans KR',
    'Noto Sans CJK KR',
    'arial',
    '돋움',
    'Dotum',
    'Tahoma',
    'Geneva',
    'sans-serif';
  }
  :root {
    --bg-page1: ${(props) => props.theme[props.mode]['bg-page1']};
    --bg-page2: ${(props) => props.theme[props.mode]['bg-page2']};
    --bg-element1: ${(props) => props.theme[props.mode]['bg-element1']};
    --bg-element2: ${(props) => props.theme[props.mode]['bg-element2']};
    --bg-element3: ${(props) => props.theme[props.mode]['bg-element3']};
    --bg-element4: ${(props) => props.theme[props.mode]['bg-element4']};
    --bg-element5: ${(props) => props.theme[props.mode]['bg-element5']};
    --bg-element6: ${(props) => props.theme[props.mode]['bg-element6']};
    --bg-element7: ${(props) => props.theme[props.mode]['bg-element7']};
    --bg-element8: ${(props) => props.theme[props.mode]['bg-element8']};
    --bg-invert: ${(props) => props.theme[props.mode]['bg-invert']};
    --bg-inline-code: ${(props) => props.theme[props.mode]['bg-inline-code']};
    --bg-tag: ${(props) => props.theme[props.mode]['bg-tag']};
    --text1: ${(props) => props.theme[props.mode]['text1']};
    --text2: ${(props) => props.theme[props.mode]['text2']};
    --text3: ${(props) => props.theme[props.mode]['text3']};
    --text4: ${(props) => props.theme[props.mode]['text4']};
    --border1: ${(props) => props.theme[props.mode]['border1']};
    --border2: ${(props) => props.theme[props.mode]['border2']};
    --border3: ${(props) => props.theme[props.mode]['border3']};
    --border4: ${(props) => props.theme[props.mode]['border4']};
    --primary1: ${(props) => props.theme[props.mode]['primary1']};
    --primary2: ${(props) => props.theme[props.mode]['primary2']};
    --destructive1: ${(props) => props.theme[props.mode]['destructive1']};
    --destructive2: ${(props) => props.theme[props.mode]['destructive2']};
    --button-text: ${(props) => props.theme[props.mode]['button-text']};
    --slight-layer: ${(props) => props.theme[props.mode]['slight-layer']};
    --opaque-layer: ${(props) => props.theme[props.mode]['opaque-layer']};
    --skeleton-base: ${(props) => props.theme[props.mode]['skeleton-base']};
    --skeleton-highlight: ${(props) =>
      props.theme[props.mode]['skeleton-highlight']};
  }

  body {
    background: var(--bg-page1);
  }

  a {
    text-decoration: none;
  }
`;

export default GlobalStyle;
