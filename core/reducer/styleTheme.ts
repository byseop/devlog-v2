import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type IStyleCode = 'light' | 'dark';
interface IStyleThemeState {
  mode: IStyleCode;
}

const initialState: IStyleThemeState = {
  mode: 'dark'
};

const styleThemeSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    toggle(state, action: PayloadAction<IStyleThemeState>) {
      state.mode = action.payload.mode;
    }
  }
});

export default styleThemeSlice;
