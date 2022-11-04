import Header from '../../Header';
import GlobalStyle from '../../../styles/global';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../styles/theme';

const DefaultLayout = ({
  children,
  className
}: React.PropsWithChildren<{ className?: string }>) => {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <div className={`layout layout-default ${className}`}>
        <div className="layout-inner layout-inner-default">{children}</div>
      </div>
      <GlobalStyle />
    </ThemeProvider>
  );
};

export default DefaultLayout;
