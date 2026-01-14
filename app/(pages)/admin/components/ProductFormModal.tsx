'use client'

import React, { useState, useRef, useCallback, memo } from 'react'
import { X, Loader2, Upload, ImagePlus } from 'lucide-react'
import Image from 'next/image'
import Swal from 'sweetalert2'
import { Product } from '@/lib/redux/slices/productsSlice'

export interface ProductFormData {
  name: string
  description: string
  price: string | number
  originalPrice: string | number
  image: string
  images: string[]
  category: string
  colors: string[]
  badge: string
  stock: string | number
  featured: boolean
}

interface Category {
  _id: string
  name: string
}

interface ProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ProductFormData, isEdit: boolean, productId?: string) => Promise<void>
  editingProduct: Product | null
  categories: Category[]
}

const COMMON_COLORS = [
  { name: 'Red', hex: '#EF4444' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Yellow', hex: '#EAB308' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Purple', hex: '#A855F7' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Black', hex: '#171717' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Gray', hex: '#6B7280' },
  { name: 'Brown', hex: '#92400E' },
  { name: 'Navy', hex: '#1E3A8A' },
] as const

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  image: '',
  images: [],
  category: '',
  colors: [],
  badge: '',
  stock: '',
  featured: false
}

const ProductFormModal = memo(function ProductFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingProduct, 
  categories 
}: ProductFormModalProps) {
  const [formData, setFormData] = useState<ProductFormData>(() => {
    if (editingProduct) {
      return {
        name: editingProduct.name,
        description: editingProduct.description || '',
        price: editingProduct.price,
        originalPrice: editingProduct.originalPrice || editingProduct.price,
        image: editingProduct.image,
        images: editingProduct.images || [editingProduct.image],
        category: editingProduct.category,
        colors: editingProduct.colors || [],
        badge: editingProduct.badge || '',
        stock: editingProduct.stock,
        featured: editingProduct.featured || false
      }
    }
    return initialFormData
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const additionalFilesRef = useRef<HTMLInputElement>(null)

  // Reset form when editingProduct changes
  React.useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description || '',
        price: editingProduct.price,
        originalPrice: editingProduct.originalPrice || editingProduct.price,
        image: editingProduct.image,
        images: editingProduct.images || [editingProduct.image],
        category: editingProduct.category,
        colors: editingProduct.colors || [],
        badge: editingProduct.badge || '',
        stock: editingProduct.stock,
        featured: editingProduct.featured || false
      })
    } else {
      setFormData(initialFormData)
    }
  }, [editingProduct])

  const handleInputChange = useCallback((field: keyof ProductFormData, value: string | number | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  // Upload image to ImgBB
  const uploadToImgBB = async (file: File): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY
    if (!apiKey) {
      throw new Error('ImgBB API key not configured')
    }

    const formDataUpload = new FormData()
    formDataUpload.append('image', file)

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formDataUpload
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const data = await response.json()
    if (!data.success) {
      throw new Error('ImgBB upload failed')
    }
    
    return data.data.url
  }

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress('Uploading main image...')

    try {
      const imageUrl = await uploadToImgBB(file)
      setFormData(prev => ({ 
        ...prev, 
        image: imageUrl,
        images: [imageUrl, ...prev.images.filter(img => img !== prev.image)]
      }))
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: err instanceof Error ? err.message : 'Failed to upload image',
        confirmButtonColor: '#111827'
      })
    } finally {
      setIsUploading(false)
      setUploadProgress('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleAdditionalImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`Uploading image ${i + 1} of ${files.length}...`)
        const imageUrl = await uploadToImgBB(files[i])
        uploadedUrls.push(imageUrl)
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }))
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: err instanceof Error ? err.message : 'Failed to upload images',
        confirmButtonColor: '#111827'
      })
    } finally {
      setIsUploading(false)
      setUploadProgress('')
      if (additionalFilesRef.current) additionalFilesRef.current.value = ''
    }
  }

  const removeAdditionalImage = useCallback((indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.price || formData.price === '') {
      Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'Please enter a price', confirmButtonColor: '#111827' })
      return
    }
    
    if (formData.stock === '' || formData.stock === undefined) {
      Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'Please enter stock quantity', confirmButtonColor: '#111827' })
      return
    }
    
    setIsSubmitting(true)
    try {
      await onSubmit(formData, !!editingProduct, editingProduct?._id)
      onClose()
    } catch (err) {
      console.error('Submit error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => handleInputChange('badge', e.target.value)}
                placeholder="e.g., New, Sale"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="w-4 h-4 text-gray-900 rounded focus:ring-gray-900"
                />
                <span className="text-sm font-medium text-gray-700">Featured Product</span>
              </label>
            </div>

            {/* Main Image Upload */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Image *</label>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    className="hidden"
                    id="main-image-upload"
                  />
                  <label
                    htmlFor="main-image-upload"
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm text-gray-600">{uploadProgress}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">Click to upload main image</span>
                      </>
                    )}
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">or enter URL:</span>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                  />
                </div>

                {formData.image && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <Image src={formData.image} alt="Main product image" fill sizes="128px" className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Images */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Images</label>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    ref={additionalFilesRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesUpload}
                    className="hidden"
                    id="additional-images-upload"
                  />
                  <label
                    htmlFor="additional-images-upload"
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <ImagePlus className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Add more images</span>
                  </label>
                </div>

                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        <Image src={img} alt={`Product image ${index + 1}`} fill sizes="80px" className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(index)}
                          className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                        {index === 0 && img === formData.image && (
                          <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5">Main</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Colors */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Colors</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {COMMON_COLORS.map((color) => {
                  const isSelected = formData.colors.includes(color.name)
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          handleInputChange('colors', formData.colors.filter(c => c !== color.name))
                        } else {
                          handleInputChange('colors', [...formData.colors, color.name])
                        }
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all text-xs font-medium ${
                        isSelected ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span 
                        className={`w-3.5 h-3.5 rounded-full ${color.hex === '#FFFFFF' ? 'border border-gray-300' : ''}`}
                        style={{ backgroundColor: color.hex }}
                      />
                      {color.name}
                    </button>
                  )
                })}
              </div>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Add custom color"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const value = e.currentTarget.value.trim()
                      if (value && !formData.colors.includes(value)) {
                        handleInputChange('colors', [...formData.colors, value])
                        e.currentTarget.value = ''
                      }
                    }
                  }}
                />
              </div>

              {formData.colors.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {formData.colors.map((color, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                      {color}
                      <button
                        type="button"
                        onClick={() => handleInputChange('colors', formData.colors.filter((_, i) => i !== index))}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {editingProduct ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                editingProduct ? 'Update Product' : 'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
})

export default ProductFormModal
