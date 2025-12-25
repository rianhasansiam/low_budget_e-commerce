'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { setProducts, setProductsLoading, setProductsError } from './slices/productsSlice';
import { setCategories, setCategoriesLoading, setCategoriesError } from './slices/categoriesSlice';
import { setFiltersData, setFiltersLoading, setFiltersError } from './slices/filtersSlice';

export default function DataProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { hasFetched: productsFetched, loading: productsLoading } = useAppSelector((state) => state.products);
  const { hasFetched: categoriesFetched, loading: categoriesLoading } = useAppSelector((state) => state.categories);
  const { hasFetched: filtersFetched, loading: filtersLoading } = useAppSelector((state) => state.filters);

  // Fetch products on mount if not already fetched
  useEffect(() => {
    if (!productsFetched && !productsLoading) {
      const fetchProducts = async () => {
        dispatch(setProductsLoading(true));
        try {
          const response = await fetch('/api/products?limit=1000');
          if (!response.ok) throw new Error('Failed to fetch products');
          const data = await response.json();
          dispatch(setProducts(data.products || data));
        } catch (error) {
          dispatch(setProductsError(error instanceof Error ? error.message : 'Failed to fetch products'));
        }
      };
      fetchProducts();
    }
  }, [dispatch, productsFetched, productsLoading]);

  // Fetch categories on mount if not already fetched
  useEffect(() => {
    if (!categoriesFetched && !categoriesLoading) {
      const fetchCategories = async () => {
        dispatch(setCategoriesLoading(true));
        try {
          const response = await fetch('/api/categories');
          if (!response.ok) throw new Error('Failed to fetch categories');
          const data = await response.json();
          dispatch(setCategories(data));
        } catch (error) {
          dispatch(setCategoriesError(error instanceof Error ? error.message : 'Failed to fetch categories'));
        }
      };
      fetchCategories();
    }
  }, [dispatch, categoriesFetched, categoriesLoading]);

  // Fetch colors and badges on mount if not already fetched
  useEffect(() => {
    if (!filtersFetched && !filtersLoading) {
      const fetchFilters = async () => {
        dispatch(setFiltersLoading(true));
        try {
          const [colorsRes, badgesRes] = await Promise.all([
            fetch('/api/colors'),
            fetch('/api/badges'),
          ]);
          
          if (!colorsRes.ok || !badgesRes.ok) {
            throw new Error('Failed to fetch filters');
          }
          
          const [colors, badges] = await Promise.all([
            colorsRes.json(),
            badgesRes.json(),
          ]);
          
          dispatch(setFiltersData({ colors, badges }));
        } catch (error) {
          dispatch(setFiltersError(error instanceof Error ? error.message : 'Failed to fetch filters'));
        }
      };
      fetchFilters();
    }
  }, [dispatch, filtersFetched, filtersLoading]);

  return <>{children}</>;
}
