import Header from '../../Header';
import GlobalStyle from '../../../styles/global';

const DefaultLayout = ({
  children,
  className
}: React.PropsWithChildren<{ className?: string }>) => {
  return (
    <>
      <Header />
      <div className={`layout layout-default ${className}`}>
        <div className="layout-inner layout-inner-default">{children}</div>
      </div>
      <GlobalStyle />
    </>
  );
};

export default DefaultLayout;
