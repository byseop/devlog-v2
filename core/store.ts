import { compose, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './reducer';

const enhancer =
  process.env.NEXT_PUBLIC_APP_ENV === 'production'
    ? compose()
    : composeWithDevTools();
export const store = createStore(rootReducer, enhancer);
