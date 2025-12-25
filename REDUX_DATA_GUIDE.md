# Redux Data Management Guide

This guide explains how data is stored and retrieved in the application to **minimize API calls**.

---

## 📋 Overview

Instead of making API calls every time a component needs data, we:

1. **Fetch all data once** when the app loads
2. **Store it in Redux** 
3. **Use custom hooks** to access cached data anywhere

**Result:** Only 2 API calls total instead of 5+ calls per page!

---

## 🏗️ Architecture

```
App Loads
    │
    ▼
┌─────────────────────────────────────────┐
│          DataProvider.tsx               │
│  Fetches products & categories ONCE     │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│            Redux Store                  │
│  ┌─────────────┐  ┌─────────────────┐  │
│  │ products    │  │ categories      │  │
│  │ - items[]   │  │ - items[]       │  │
│  │ - loading   │  │ - loading       │  │
│  │ - hasFetched│  │ - hasFetched    │  │
│  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│          Custom Hooks                   │
│  useProducts(), useCategories(), etc.   │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│           Components                    │
│  Access data without API calls!         │
└─────────────────────────────────────────┘
```

---

## 📁 File Structure

```
lib/redux/
├── store.ts              # Redux store configuration
├── hooks.ts              # Custom hooks for data access
├── StoreProvider.tsx     # Redux provider wrapper
├── DataProvider.tsx      # Fetches data on app load
└── slices/
    ├── productsSlice.ts    # Products state & actions
    ├── categoriesSlice.ts  # Categories state & actions
    ├── cartSlice.ts        # Cart state
    └── userSlice.ts        # User state
```

---

## 🔍 How to GET Data

### Get All Products

```tsx
import { useProducts } from "@/lib/redux/hooks";

function MyComponent() {
  const { products, loading, error } = useProducts();

  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {products.map((product) => (
        <div key={product._id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### Get Featured Products

```tsx
import { useFeaturedProducts } from "@/lib/redux/hooks";

function FeaturedSection() {
  const { products, loading } = useFeaturedProducts();
  
  // Returns only products where featured === true
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
```

### Get Single Product by ID

```tsx
import { useProductById } from "@/lib/redux/hooks";

function ProductDetails({ productId }: { productId: string }) {
  const { product, loading } = useProductById(productId);

  if (!product) return <div>Product not found</div>;
  
  return <div>{product.name}</div>;
}
```

### Get Products by Category

```tsx
import { useProductsByCategory } from "@/lib/redux/hooks";

function CategoryPage({ category }: { category: string }) {
  const { products, loading } = useProductsByCategory(category);
  
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
```

### Get All Categories

```tsx
import { useCategories } from "@/lib/redux/hooks";

function CategoryList() {
  const { categories, loading } = useCategories();
  
  return (
    <div>
      {categories.map((cat) => (
        <div key={cat._id}>{cat.name} ({cat.productCount})</div>
      ))}
    </div>
  );
}
```

---

## ✏️ How to UPDATE Data (CRUD Operations)

After performing CRUD operations via API, update Redux to keep data in sync:

### Add New Product

```tsx
import { useAppDispatch } from "@/lib/redux/hooks";
import { addProduct } from "@/lib/redux/slices/productsSlice";

function AddProductForm() {
  const dispatch = useAppDispatch();

  const handleSubmit = async (productData) => {
    // 1. Call API
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    const data = await response.json();

    // 2. Update Redux store (no re-fetch needed!)
    dispatch(addProduct(data.product));
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Update Product

```tsx
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateProduct } from "@/lib/redux/slices/productsSlice";

function EditProduct({ product }) {
  const dispatch = useAppDispatch();

  const handleUpdate = async (updatedData) => {
    // 1. Call API
    await fetch(`/api/products/${product._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    // 2. Update Redux store
    dispatch(updateProduct({ ...product, ...updatedData }));
  };

  return <button onClick={() => handleUpdate(newData)}>Update</button>;
}
```

### Delete Product

```tsx
import { useAppDispatch } from "@/lib/redux/hooks";
import { deleteProduct } from "@/lib/redux/slices/productsSlice";

function DeleteButton({ productId }) {
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    // 1. Call API
    await fetch(`/api/products/${productId}`, { method: "DELETE" });

    // 2. Remove from Redux store
    dispatch(deleteProduct(productId));
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

### Category CRUD (Same Pattern)

```tsx
import { addCategory, updateCategory, deleteCategory } from "@/lib/redux/slices/categoriesSlice";

// Add category
dispatch(addCategory(newCategory));

// Update category
dispatch(updateCategory(updatedCategory));

// Delete category
dispatch(deleteCategory(categoryId));
```

---

## 📊 Available Hooks Reference

| Hook | Returns | Description |
|------|---------|-------------|
| `useProducts()` | `{ products, loading, error, hasFetched }` | All products |
| `useFeaturedProducts()` | `{ products, loading, error }` | Featured products only |
| `useProductById(id)` | `{ product, loading, error }` | Single product |
| `useProductsByCategory(cat)` | `{ products, loading, error }` | Products in category |
| `useCategories()` | `{ categories, loading, error, hasFetched }` | All categories |
| `useCategoryById(id)` | `{ category, loading, error }` | Single category |
| `useAppDispatch()` | `dispatch` | Redux dispatch function |
| `useAppSelector()` | `selector` | Redux state selector |

---

## 📊 Available Actions Reference

### Products Actions

| Action | Parameters | Description |
|--------|------------|-------------|
| `setProducts(products)` | `Product[]` | Set all products |
| `setProductsLoading(bool)` | `boolean` | Set loading state |
| `setProductsError(msg)` | `string` | Set error message |
| `addProduct(product)` | `Product` | Add single product |
| `updateProduct(product)` | `Product` | Update single product |
| `deleteProduct(id)` | `string` | Delete by ID |
| `selectProduct(product)` | `Product` | Set selected product |
| `clearSelectedProduct()` | - | Clear selection |

### Categories Actions

| Action | Parameters | Description |
|--------|------------|-------------|
| `setCategories(cats)` | `Category[]` | Set all categories |
| `setCategoriesLoading(bool)` | `boolean` | Set loading state |
| `setCategoriesError(msg)` | `string` | Set error message |
| `addCategory(cat)` | `Category` | Add single category |
| `updateCategory(cat)` | `Category` | Update single category |
| `deleteCategory(id)` | `string` | Delete by ID |

---

## 🔄 Data Types

### Product

```typescript
interface Product {
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
```

### Category

```typescript
interface Category {
  _id: string;
  name: string;
  image: string;
  productCount: number;
}
```

---

## ⚡ Performance Benefits

| Scenario | Before | After |
|----------|--------|-------|
| Homepage | 3 API calls | 0 (uses Redux) |
| All Products | 2 API calls | 0 (uses Redux) |
| Category page | 2 API calls | 0 (uses Redux) |
| Product details | 1 API call | 0 (uses Redux) |
| **App Load** | - | 2 API calls |
| **Total per session** | 8+ calls | **2 calls** |

---

## 🚀 Quick Start Example

```tsx
"use client";

import { useProducts, useCategories, useAppDispatch } from "@/lib/redux/hooks";
import { addProduct } from "@/lib/redux/slices/productsSlice";

export default function ExampleComponent() {
  const dispatch = useAppDispatch();
  
  // GET data (no API call - from Redux)
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();

  // ADD new product (API + Redux update)
  const handleAdd = async () => {
    const newProduct = { name: "New Product", price: 100, ... };
    
    const res = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(newProduct),
    });
    const data = await res.json();
    
    dispatch(addProduct(data.product)); // Update Redux
  };

  if (productsLoading || categoriesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Products ({products.length})</h2>
      <h2>Categories ({categories.length})</h2>
      <button onClick={handleAdd}>Add Product</button>
    </div>
  );
}
```

---

## ❓ FAQ

**Q: When does data get fetched?**  
A: Once when the app first loads (in `DataProvider.tsx`)

**Q: What if I need fresh data?**  
A: After CRUD operations, dispatch the appropriate action to update Redux. For a full refresh, you can dispatch `setProducts([])` with `hasFetched: false` and reload.

**Q: Do I need to use TanStack Query anymore?**  
A: Not for products/categories! You may still use it for other data like colors, badges, or user-specific data.

**Q: What happens on page refresh?**  
A: Redux resets, and `DataProvider` fetches fresh data from API (2 calls total).
