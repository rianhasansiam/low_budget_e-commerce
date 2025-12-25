import { useDispatch, useSelector, useStore } from 'react-redux';
import type { AppDispatch, AppStore, RootState } from './store';
import { useMemo } from 'react';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

// Custom hook to get all products from Redux
export const useProducts = () => {
  const { items, loading, error, hasFetched } = useAppSelector((state) => state.products);
  return { products: items, loading, error, hasFetched };
};

// Custom hook to get featured products from Redux
export const useFeaturedProducts = () => {
  const { items, loading, error } = useAppSelector((state) => state.products);
  const featuredProducts = useMemo(() => items.filter((p) => p.featured), [items]);
  return { products: featuredProducts, loading, error };
};

// Custom hook to get a single product by ID from Redux
export const useProductById = (id: string) => {
  const { items, loading, error } = useAppSelector((state) => state.products);
  const product = useMemo(() => items.find((p) => p._id === id), [items, id]);
  return { product, loading, error };
};

// Custom hook to get products by category from Redux
export const useProductsByCategory = (category: string) => {
  const { items, loading, error } = useAppSelector((state) => state.products);
  const products = useMemo(
    () => items.filter((p) => p.category.toLowerCase() === category.toLowerCase()),
    [items, category]
  );
  return { products, loading, error };
};

// Custom hook to get all categories from Redux
export const useCategories = () => {
  const { items, loading, error, hasFetched } = useAppSelector((state) => state.categories);
  return { categories: items, loading, error, hasFetched };
};

// Custom hook to get a single category by ID from Redux
export const useCategoryById = (id: string) => {
  const { items, loading, error } = useAppSelector((state) => state.categories);
  const category = useMemo(() => items.find((c) => c._id === id), [items, id]);
  return { category, loading, error };
};

// Custom hook to get colors from Redux (for filters)
export const useColors = () => {
  const { colors, loading, error, hasFetched } = useAppSelector((state) => state.filters);
  return { colors, loading, error, hasFetched };
};

// Custom hook to get badges from Redux (for filters)
export const useBadges = () => {
  const { badges, loading, error, hasFetched } = useAppSelector((state) => state.filters);
  return { badges, loading, error, hasFetched };
};

// Custom hook to get all filter data from Redux
export const useFilters = () => {
  const { colors, badges, loading, error, hasFetched } = useAppSelector((state) => state.filters);
  return { colors, badges, loading, error, hasFetched };
};
