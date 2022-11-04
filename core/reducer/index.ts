import { AnyAction, combineReducers } from '@reduxjs/toolkit';

import styleThemeSlice from './styleTheme';

const combineReducer = combineReducers({
  theme: styleThemeSlice.reducer
});

const rootReducer = (state: RootReducerTypes | undefined, action: AnyAction) =>
  combineReducer(state, action);

export type RootReducerTypes = ReturnType<typeof combineReducer>;

export default rootReducer;
