import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Category {
  _id: string;
  name: string;
  image: string;
  productCount: number;
}

interface CategoriesState {
  items: Category[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
}

const initialState: CategoriesState = {
  items: [],
  loading: false,
  error: null,
  hasFetched: false,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
      state.hasFetched = true;
    },
    setCategoriesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCategoriesError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.items.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.items.findIndex((cat) => cat._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((cat) => cat._id !== action.payload);
    },
  },
});

export const {
  setCategories,
  setCategoriesLoading,
  setCategoriesError,
  addCategory,
  updateCategory,
  deleteCategory,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
