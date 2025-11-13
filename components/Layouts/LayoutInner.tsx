'use client';

import { useTheme } from '@/contexts/ThemeContext';
import GlobalStyle from '@styles/global';

const LayoutInner = ({ children }: React.PropsWithChildren) => {
  const { mode } = useTheme();

  return (
    <>
      {children}
      <GlobalStyle mode={mode} />
    </>
  );
};

export default LayoutInner;
