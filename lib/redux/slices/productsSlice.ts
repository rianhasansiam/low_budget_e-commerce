import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  images: string[];
  category: string;
  colors: string[];
  badge: string;
  stock: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  selectedProduct: Product | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  hasFetched: false,
  selectedProduct: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
      state.hasFetched = true;
    },
    setProductsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProductsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    selectProduct: (state, action: PayloadAction<Product>) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.unshift(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p._id !== action.payload);
    },
  },
});

export const {
  setProducts,
  setProductsLoading,
  setProductsError,
  selectProduct,
  clearSelectedProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} = productsSlice.actions;

export default productsSlice.reducer;
