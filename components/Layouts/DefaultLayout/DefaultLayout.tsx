import Header from '../../Header';

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
    </>
  );
};

export default DefaultLayout;
