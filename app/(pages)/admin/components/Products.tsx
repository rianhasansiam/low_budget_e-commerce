'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { Search, Plus, Edit, Trash2, Eye, X, Loader2, Package } from 'lucide-react'
import Image from 'next/image'
import Swal from 'sweetalert2'
import { useAppDispatch } from '@/lib/redux/hooks'
import { useProducts, useCategories } from '@/lib/redux/hooks'
import {
  addProduct as addProductAction,
  updateProduct as updateProductAction,
  deleteProduct as deleteProductAction,
  Product
} from '@/lib/redux/slices/productsSlice'
import ProductFormModal, { ProductFormData } from './ProductFormModal'

// Items per page for pagination
const ITEMS_PER_PAGE = 20

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null)

  const dispatch = useAppDispatch()
  const { products, loading, error } = useProducts()
  const { categories } = useCategories()

  // Filter products based on search term and category filter (client-side)
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = !categoryFilter || product.category === categoryFilter
      
      return matchesSearch && matchesCategory
    })
  }, [products, searchTerm, categoryFilter])

  // Paginated products for display
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredProducts, currentPage])

  // Total pages calculation
  const totalPages = useMemo(() => Math.ceil(filteredProducts.length / ITEMS_PER_PAGE), [filteredProducts.length])

  // Reset page when filters change
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }, [])

  const handleCategoryChange = useCallback((value: string) => {
    setCategoryFilter(value)
    setCurrentPage(1)
  }, [])

  // Format currency
  const formatCurrency = useCallback((amount: number) => {
    return `৳${amount.toLocaleString('en-BD')}`
  }, [])

  // Get stock status
  const getStockStatus = useCallback((stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', style: 'bg-red-100 text-red-700' }
    if (stock <= 5) return { label: 'Low Stock', style: 'bg-yellow-100 text-yellow-700' }
    return { label: 'In Stock', style: 'bg-green-100 text-green-700' }
  }, [])

  // Open add modal
  const openAddModal = useCallback(() => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }, [])

  // Open edit modal
  const openEditModal = useCallback((product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }, [])

  // Close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }, [])

  // Open view modal
  const openViewModal = useCallback((product: Product) => {
    setViewingProduct(product)
    setIsViewModalOpen(true)
  }, [])

  // Handle form submit from modal
  const handleFormSubmit = useCallback(async (formData: ProductFormData, isEdit: boolean, productId?: string) => {
    // Convert string values to numbers for submission
    const productData = {
      ...formData,
      price: Number(formData.price) || 0,
      originalPrice: Number(formData.originalPrice) || Number(formData.price) || 0,
      stock: Number(formData.stock) || 0,
      images: formData.image ? [formData.image, ...formData.images.filter(img => img !== formData.image)] : formData.images
    }

    if (isEdit && productId) {
      // Update existing product
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update product')
      }
      
      dispatch(updateProductAction({ 
        _id: productId,
        ...productData, 
        updatedAt: new Date().toISOString() 
      } as Product))
      
      Swal.fire({
        icon: 'success',
        title: 'Product Updated!',
        text: `"${formData.name}" has been updated successfully.`,
        confirmButtonColor: '#111827',
        timer: 2500,
        timerProgressBar: true
      })
    } else {
      // Add new product
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add product')
      }
      
      const result = await response.json()
      dispatch(addProductAction({
        _id: result.insertedId,
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Product))
      
      Swal.fire({
        icon: 'success',
        title: 'Product Added!',
        text: `"${formData.name}" has been added successfully.`,
        confirmButtonColor: '#111827',
        timer: 2500,
        timerProgressBar: true
      })
    }
  }, [dispatch])

  // Handle delete
  const handleDelete = async (productId: string) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete Product?',
      text: 'This action cannot be undone. Are you sure you want to delete this product?',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    })
    
    if (!result.isConfirmed) {
      return
    }
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete product')
      }

      dispatch(deleteProductAction(productId))
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Product has been deleted successfully.',
        confirmButtonColor: '#111827',
        timer: 2000,
        timerProgressBar: true
      })
    } catch (err) {
      console.error('Error deleting product:', err)
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: err instanceof Error ? err.message : 'Failed to delete product. Please try again.',
        confirmButtonColor: '#111827'
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load products. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your product inventory ({products.length} total)
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm bg-white w-full sm:w-auto"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table - Desktop */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Price</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock)
                  return (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900 text-sm">{product.name}</span>
                            {product.badge && (
                              <span className="ml-2 px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">
                                {product.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{product.category}</td>
                      <td className="px-5 py-4">
                        <div>
                          <span className="text-sm font-semibold text-gray-900">{formatCurrency(product.price)}</span>
                          {product.originalPrice > product.price && (
                            <span className="ml-2 text-xs text-gray-400 line-through">
                              {formatCurrency(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{product.stock}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${stockStatus.style}`}>
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openViewModal(product)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Products Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {paginatedProducts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500">
            No products found
          </div>
        ) : (
          paginatedProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock)
            return (
              <div key={product._id} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-gray-900 text-sm truncate">{product.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${stockStatus.style}`}>
                        {stockStatus.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{product.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(product.price)}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Stock: {product.stock}</span>
                    {product.badge && (
                      <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded">{product.badge}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openViewModal(product)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 text-sm rounded-lg ${
                      currentPage === pageNum 
                        ? 'bg-gray-900 text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editingProduct={editingProduct}
        categories={categories}
        onSubmit={handleFormSubmit}
      />

      {/* View Product Modal */}
      {isViewModalOpen && viewingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {viewingProduct.image && (
                <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={viewingProduct.image}
                    alt={viewingProduct.name}
                    fill
                    sizes="(max-width: 512px) 100vw, 512px"
                    className="object-cover"
                  />
                </div>
              )}

              <div>
                <h4 className="text-xl font-semibold text-gray-900">{viewingProduct.name}</h4>
                {viewingProduct.badge && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">
                    {viewingProduct.badge}
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-sm">{viewingProduct.description || 'No description available'}</p>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Price</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(viewingProduct.price)}</p>
                  {viewingProduct.originalPrice > viewingProduct.price && (
                    <p className="text-sm text-gray-400 line-through">{formatCurrency(viewingProduct.originalPrice)}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Stock</p>
                  <p className="font-semibold text-gray-900">{viewingProduct.stock} units</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Category</p>
                  <p className="font-semibold text-gray-900">{viewingProduct.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Featured</p>
                  <p className="font-semibold text-gray-900">{viewingProduct.featured ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {viewingProduct.colors && viewingProduct.colors.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 uppercase mb-2">Colors</p>
                  <div className="flex gap-2 flex-wrap">
                    {viewingProduct.colors.map((color, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false)
                    openEditModal(viewingProduct)
                  }}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Product
                </button>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products