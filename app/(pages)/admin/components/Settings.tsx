'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  Settings as SettingsIcon, 
  Truck, 
  Save, 
  Loader2,
  DollarSign,
  Package,
  CheckCircle,
  ImageIcon,
  Plus,
  Trash2,
  Edit2,
  X,
  Link as LinkIcon,
  GripVertical,
  Eye,
  EyeOff
} from 'lucide-react'
import Swal from 'sweetalert2'

interface ShippingSettings {
  standardFee: number
  freeShippingThreshold: number
  expressShippingFee: number
  enableFreeShipping: boolean
}

interface SiteSettings {
  _id?: string
  shipping: ShippingSettings
  general: {
    siteName: string
    currency: string
    currencySymbol: string
  }
}

interface HeroSlide {
  _id: string
  image: string
  link: string
  alt: string
  type: 'main' | 'side'
  order: number
  active: boolean
}

export default function Settings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Hero Slides State
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [slidesLoading, setSlidesLoading] = useState(true)
  const [showSlideModal, setShowSlideModal] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [slideForm, setSlideForm] = useState({
    image: '',
    link: '/allProducts',
    alt: '',
    type: 'main' as 'main' | 'side'
  })
  const [uploadingImage, setUploadingImage] = useState(false)

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings()
    fetchHeroSlides()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      if (data.success) {
        setSettings(data.data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load settings'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      
      const data = await response.json()
      
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Settings Saved!',
          text: 'Your settings have been updated successfully.',
          timer: 2000,
          showConfirmButton: false
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save settings'
      })
    } finally {
      setSaving(false)
    }
  }

  const updateShipping = (field: keyof ShippingSettings, value: number | boolean) => {
    if (!settings) return
    setSettings({
      ...settings,
      shipping: {
        ...settings.shipping,
        [field]: value
      }
    })
  }

  // Hero Slides Functions
  const fetchHeroSlides = async () => {
    try {
      const response = await fetch('/api/hero-slides')
      const data = await response.json()
      if (data.success) {
        setHeroSlides(data.data)
      }
    } catch (error) {
      console.error('Error fetching hero slides:', error)
    } finally {
      setSlidesLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB_API_KEY}`,
        { method: 'POST', body: formData }
      )
      
      const data = await response.json()
      if (data.success) {
        setSlideForm(prev => ({ ...prev, image: data.data.url }))
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Failed to upload image. Please try again.'
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const openAddSlideModal = (type: 'main' | 'side') => {
    setEditingSlide(null)
    setSlideForm({ image: '', link: '/allProducts', alt: '', type })
    setShowSlideModal(true)
  }

  const openEditSlideModal = (slide: HeroSlide) => {
    setEditingSlide(slide)
    setSlideForm({
      image: slide.image,
      link: slide.link,
      alt: slide.alt,
      type: slide.type
    })
    setShowSlideModal(true)
  }

  const handleSaveSlide = async () => {
    if (!slideForm.image) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please upload an image' })
      return
    }

    try {
      if (editingSlide) {
        // Update existing slide
        const response = await fetch(`/api/hero-slides/${editingSlide._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slideForm)
        })
        const data = await response.json()
        if (data.success) {
          setHeroSlides(prev => prev.map(s => s._id === editingSlide._id ? data.data : s))
          Swal.fire({ icon: 'success', title: 'Updated!', timer: 1500, showConfirmButton: false })
        }
      } else {
        // Add new slide
        const response = await fetch('/api/hero-slides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slideForm)
        })
        const data = await response.json()
        if (data.success) {
          setHeroSlides(prev => [...prev, data.data])
          Swal.fire({ icon: 'success', title: 'Added!', timer: 1500, showConfirmButton: false })
        }
      }
      setShowSlideModal(false)
    } catch (error) {
      console.error('Error saving slide:', error)
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to save slide' })
    }
  }

  const handleDeleteSlide = async (slideId: string) => {
    const result = await Swal.fire({
      title: 'Delete Slide?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Delete'
    })

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/hero-slides/${slideId}`, { method: 'DELETE' })
        const data = await response.json()
        if (data.success) {
          setHeroSlides(prev => prev.filter(s => s._id !== slideId))
          Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false })
        }
      } catch (error) {
        console.error('Error deleting slide:', error)
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete slide' })
      }
    }
  }

  const handleToggleSlideActive = async (slide: HeroSlide) => {
    try {
      const response = await fetch(`/api/hero-slides/${slide._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !slide.active })
      })
      const data = await response.json()
      if (data.success) {
        setHeroSlides(prev => prev.map(s => s._id === slide._id ? data.data : s))
      }
    } catch (error) {
      console.error('Error toggling slide:', error)
    }
  }

  const mainSlides = heroSlides.filter(s => s.type === 'main')
  const sideSlides = heroSlides.filter(s => s.type === 'side')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load settings</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Settings</h2>
            <p className="text-sm text-gray-500">Manage your store settings</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Shipping Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Shipping Settings</h3>
              <p className="text-sm text-gray-500">Configure shipping fees and thresholds</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Standard Shipping Fee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Standard Shipping Fee (৳)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={settings.shipping.standardFee}
                  onChange={(e) => updateShipping('standardFee', Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
                  placeholder="100"
                  min="0"
                />
              </div>
              <p className="mt-1.5 text-xs text-gray-500">
                Default shipping fee for all orders
              </p>
            </div>

            {/* Express Shipping Fee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Express Shipping Fee (৳)
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={settings.shipping.expressShippingFee}
                  onChange={(e) => updateShipping('expressShippingFee', Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
                  placeholder="200"
                  min="0"
                />
              </div>
              <p className="mt-1.5 text-xs text-gray-500">
                Fee for express/priority delivery
              </p>
            </div>
          </div>

          {/* Free Shipping Toggle */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Enable Free Shipping</p>
                  <p className="text-sm text-gray-500">
                    Offer free shipping for orders above threshold
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.shipping.enableFreeShipping}
                  onChange={(e) => updateShipping('enableFreeShipping', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-900/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>

          {/* Free Shipping Threshold */}
          {settings.shipping.enableFreeShipping && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Free Shipping Threshold (৳)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={settings.shipping.freeShippingThreshold}
                  onChange={(e) => updateShipping('freeShippingThreshold', Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
                  placeholder="5000"
                  min="0"
                />
              </div>
              <p className="mt-1.5 text-xs text-gray-500">
                Orders above this amount will get free shipping
              </p>
            </div>
          )}

          {/* Preview */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="font-medium text-blue-900 mb-2">Shipping Preview</h4>
            <div className="space-y-1 text-sm text-blue-700">
              <p>• Standard shipping: <strong>৳{settings.shipping.standardFee.toLocaleString('en-BD')}</strong></p>
              <p>• Express shipping: <strong>৳{settings.shipping.expressShippingFee.toLocaleString('en-BD')}</strong></p>
              {settings.shipping.enableFreeShipping && (
                <p>• Free shipping on orders over: <strong>৳{settings.shipping.freeShippingThreshold.toLocaleString('en-BD')}</strong></p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Slides Management */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Hero Slides</h3>
              <p className="text-sm text-gray-500">Manage homepage carousel and banner images</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {slidesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              {/* Main Carousel Slides */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Main Carousel Slides</h4>
                  <button
                    onClick={() => openAddSlideModal('main')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Slide
                  </button>
                </div>
                
                {mainSlides.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No main slides yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mainSlides.map((slide) => (
                      <div key={slide._id} className="relative group rounded-xl overflow-hidden border border-gray-200">
                        <div className="relative h-32">
                          <Image
                            src={slide.image}
                            alt={slide.alt}
                            fill
                            className="object-cover"
                          />
                          {!slide.active && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white text-sm font-medium">Inactive</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3 bg-white">
                          <p className="text-xs text-gray-500 truncate">{slide.alt || 'No description'}</p>
                          <p className="text-xs text-blue-600 truncate">{slide.link}</p>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleToggleSlideActive(slide)}
                            className="p-1.5 bg-white rounded-lg shadow hover:bg-gray-100"
                            title={slide.active ? 'Hide' : 'Show'}
                          >
                            {slide.active ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                          </button>
                          <button
                            onClick={() => openEditSlideModal(slide)}
                            className="p-1.5 bg-white rounded-lg shadow hover:bg-gray-100"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteSlide(slide._id)}
                            className="p-1.5 bg-white rounded-lg shadow hover:bg-gray-100"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Side Banner Slides */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Side Banners</h4>
                  <button
                    onClick={() => openAddSlideModal('side')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm hover:bg-orange-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Banner
                  </button>
                </div>
                
                {sideSlides.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No side banners yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sideSlides.map((slide) => (
                      <div key={slide._id} className="relative group rounded-xl overflow-hidden border border-gray-200">
                        <div className="relative h-40">
                          <Image
                            src={slide.image}
                            alt={slide.alt}
                            fill
                            className="object-cover"
                          />
                          {!slide.active && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white text-sm font-medium">Inactive</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3 bg-white">
                          <p className="text-xs text-gray-500 truncate">{slide.alt || 'No description'}</p>
                          <p className="text-xs text-blue-600 truncate">{slide.link}</p>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleToggleSlideActive(slide)}
                            className="p-1.5 bg-white rounded-lg shadow hover:bg-gray-100"
                            title={slide.active ? 'Hide' : 'Show'}
                          >
                            {slide.active ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                          </button>
                          <button
                            onClick={() => openEditSlideModal(slide)}
                            className="p-1.5 bg-white rounded-lg shadow hover:bg-gray-100"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteSlide(slide._id)}
                            className="p-1.5 bg-white rounded-lg shadow hover:bg-gray-100"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Slide Modal */}
      {showSlideModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingSlide ? 'Edit Slide' : `Add ${slideForm.type === 'main' ? 'Carousel Slide' : 'Side Banner'}`}
              </h3>
              <button onClick={() => setShowSlideModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                {slideForm.image ? (
                  <div className="relative h-40 rounded-xl overflow-hidden border border-gray-200">
                    <Image src={slideForm.image} alt="Preview" fill className="object-cover" />
                    <button
                      onClick={() => setSlideForm(prev => ({ ...prev, image: '' }))}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                    {uploadingImage ? (
                      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Click to upload image</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                )}
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={slideForm.link}
                    onChange={(e) => setSlideForm(prev => ({ ...prev, link: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                    placeholder="/allProducts or https://..."
                  />
                </div>
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Alt Text)</label>
                <input
                  type="text"
                  value={slideForm.alt}
                  onChange={(e) => setSlideForm(prev => ({ ...prev, alt: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                  placeholder="Describe this banner..."
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setShowSlideModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSlide}
                disabled={!slideForm.image}
                className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:bg-gray-300"
              >
                {editingSlide ? 'Update' : 'Add'} Slide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
