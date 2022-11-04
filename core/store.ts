import { compose, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer } from 'redux-persist';
import persistStore from 'redux-persist/es/persistStore';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

import rootReducer, { RootReducerTypes } from './reducer';

const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    }
  };
};

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage();

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [],
  stateReconciler: autoMergeLevel2
};

const reducer = persistReducer<RootReducerTypes>(persistConfig, rootReducer);

const enhancer =
  process.env.APP_ENV === 'production' ? compose() : composeWithDevTools();
export const store = createStore(reducer, enhancer);
export const persistor = persistStore(store);
