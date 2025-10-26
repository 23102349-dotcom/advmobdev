import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ThemeState {
  mode: 'light' | 'dark' | 'custom';
  customAccentColor: string;
  isAnimating: boolean;
}

const initialState: ThemeState = {
  mode: 'light',
  customAccentColor: '#0a7ea4',
  isAnimating: false,
};

const THEME_STORAGE_KEY = '@theme_settings';

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<'light' | 'dark' | 'custom'>) => {
      state.mode = action.payload;
      state.isAnimating = true;
    },
    setCustomAccentColor: (state, action: PayloadAction<string>) => {
      state.customAccentColor = action.payload;
    },
    setAnimating: (state, action: PayloadAction<boolean>) => {
      state.isAnimating = action.payload;
    },
    loadThemeFromStorage: (state, action: PayloadAction<Partial<ThemeState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setThemeMode, setCustomAccentColor, setAnimating, loadThemeFromStorage } = themeSlice.actions;

// Simple async functions (not thunks) - disabled for stability
export const saveThemeToStorage = async (theme: ThemeState) => {
  // Disabled to prevent crashes
  console.log('Theme would be saved:', theme);
};

export const loadThemeFromStorageAsync = async () => {
  // Disabled to prevent crashes
  return null;
};

export default themeSlice.reducer;
