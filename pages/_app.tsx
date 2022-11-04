import { Provider } from 'react-redux';
import { DefaultLayout } from '../components/Layouts';
import { store, persistor } from '../core/store';
import { PersistGate } from 'redux-persist/integration/react';

import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </PersistGate>
    </Provider>
  );
}
