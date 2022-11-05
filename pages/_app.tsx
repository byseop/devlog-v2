import { Provider } from 'react-redux';
import { DefaultLayout } from '../components/Layouts';
import { store, persistor } from '../core/store';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';
import LayoutInner from '../components/Layouts/LayoutInner';
import { QueryClient, QueryClientProvider } from 'react-query';

import type { AppProps } from 'next/app';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false
      // onError: handlerError
    },
    mutations: {
      // onError: handlerError
    }
  }
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <DefaultLayout>
              <LayoutInner>
                <Component {...pageProps} />
              </LayoutInner>
            </DefaultLayout>
          </ThemeProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
