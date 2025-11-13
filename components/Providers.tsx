'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { theme } from '@styles/theme';
import { SkeletonTheme } from 'react-loading-skeleton';

import 'react-loading-skeleton/dist/skeleton.css';

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { mode } = useTheme();

  return (
    <StyledThemeProvider theme={theme}>
      <SkeletonTheme
        baseColor={mode === 'dark' ? '#15202B' : '#ebebeb'}
        highlightColor={mode === 'dark' ? '#38444d' : '#f5f5f5'}
      >
        {children}
      </SkeletonTheme>
    </StyledThemeProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ThemeWrapper>{children}</ThemeWrapper>
      </ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
