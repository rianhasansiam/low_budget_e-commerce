import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ColorData {
  name: string;
  count: number;
}

export interface BadgeData {
  name: string;
  count: number;
}

interface FiltersState {
  colors: ColorData[];
  badges: BadgeData[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
}

const initialState: FiltersState = {
  colors: [],
  badges: [],
  loading: false,
  error: null,
  hasFetched: false,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setColors: (state, action: PayloadAction<ColorData[]>) => {
      state.colors = action.payload;
    },
    setBadges: (state, action: PayloadAction<BadgeData[]>) => {
      state.badges = action.payload;
    },
    setFiltersData: (state, action: PayloadAction<{ colors: ColorData[]; badges: BadgeData[] }>) => {
      state.colors = action.payload.colors;
      state.badges = action.payload.badges;
      state.loading = false;
      state.error = null;
      state.hasFetched = true;
    },
    setFiltersLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setFiltersError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setColors,
  setBadges,
  setFiltersData,
  setFiltersLoading,
  setFiltersError,
} = filtersSlice.actions;

export default filtersSlice.reducer;
