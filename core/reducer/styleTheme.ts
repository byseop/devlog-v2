import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type IStyleCode = 'light' | 'dark';
interface IStyleThemeState {
  mode: IStyleCode;
}

const initialState: IStyleThemeState = {
  mode: 'light'
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
