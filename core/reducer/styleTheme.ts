import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type IStyleCode = 'light' | 'dark';
interface IStyleThemeState {
  mode: IStyleCode;
}

const initialState: IStyleThemeState = {
  mode: (() => {
    let defaultTheme = 'dark' as IStyleCode;
    if (typeof window !== 'undefined') {
      const theme = localStorage.getItem('theme');
      if (theme === 'light' || theme === 'dark') {
        defaultTheme = theme;
      }
    }
    return defaultTheme;
  })()
};

const styleThemeSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    toggle(state, action: PayloadAction<IStyleThemeState>) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload.mode);
      }
      state.mode = action.payload.mode;
    }
  }
});

export default styleThemeSlice;
