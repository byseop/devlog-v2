import 'styled-components';
import { theme } from './theme';

declare module 'styled-components' {
  export interface DefaultTheme {
    dark: typeof theme.dark;
    light: typeof theme.light;
  }
}
