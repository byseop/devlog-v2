import { ComponentProps, Suspense } from 'react';
import useMounted from '../../core/hooks/useMounted';

const CustomSuspense = (props: ComponentProps<typeof Suspense>) => {
  const isMounted = useMounted();

  if (isMounted) {
    return <Suspense {...props} />;
  }
  return <>{props.fallback}</>;
};

export default CustomSuspense;
