import { Provider } from 'react-redux';
import { DefaultLayout } from '../components/Layouts';
import { store, persistor } from '../core/store';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';
import LayoutInner from '../components/Layouts/LayoutInner';

import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <ThemeProvider theme={theme}>
          <DefaultLayout>
            <LayoutInner>
              <Component {...pageProps} />
            </LayoutInner>
          </DefaultLayout>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
