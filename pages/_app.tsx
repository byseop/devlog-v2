import { Provider } from 'react-redux';
import { DefaultLayout } from '@components/Layouts';
import { store } from '@core/store';
import { ThemeProvider } from 'styled-components';
import { theme } from '@styles/theme';
import LayoutInner from '@components/Layouts/LayoutInner';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import NextNProgress from 'nextjs-progressbar';
import Script from 'next/script';
import { DefaultSeo } from 'next-seo';
import SEO from '../next-seo.config';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Analytics } from '@vercel/analytics/react';

import 'react-loading-skeleton/dist/skeleton.css';

import type { AppProps } from 'next/app';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false
      // onError: handlerError
      // suspense: true
    },
    mutations: {
      // onError: handlerError
    }
  }
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <DefaultSeo {...SEO} />
          <NextNProgress />
          <Analytics />
          {process.env.NEXT_PUBLIC_APP_ENV === 'production' && (
            <>
              <Script
                strategy="afterInteractive"
                src="https://www.googletagmanager.com/gtag/js?id=G-7GJZ6E40WG"
              />
              <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                
                  gtag('config', 'G-7GJZ6E40WG');
                `
                }}
              />
            </>
          )}
          <SkeletonTheme
            baseColor="var(--skeleton-base)"
            highlightColor="var(--skeleton-highlight)"
          >
            <DefaultLayout>
              <LayoutInner>
                <Component {...pageProps} />
              </LayoutInner>
            </DefaultLayout>
          </SkeletonTheme>
        </ThemeProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </Provider>
  );
}
