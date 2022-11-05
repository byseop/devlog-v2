import useRootState from '../../core/hooks/useRootState';
import GlobalStyle from '../../styles/global';

const LayoutInner = ({ children }: React.PropsWithChildren) => {
  const { mode } = useRootState((state) => state.theme);

  return (
    <>
      {children}
      <GlobalStyle mode={mode} />
    </>
  );
};

export default LayoutInner;
