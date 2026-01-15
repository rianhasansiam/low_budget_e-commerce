'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  ChevronRight,
  ShoppingBag,
  Loader2,
  Calendar,
  MapPin,
  Banknote,
  Phone,
  Star,
  X,
  Send,
  ImagePlus,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Swal from 'sweetalert2'

// Order item interface matching API response
interface OrderItem {
  product_id: string
  productId?: string
  name: string
  quantity: number
  unit_price: number
  subtotal: number
  image?: string
}

// Order interface matching API response
interface Order {
  _id: string
  customer_name: string
  email: string
  phone: string
  order_date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  shipping_address: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  items: OrderItem[]
  payment_method: string
  subtotal?: number
  shipping_cost?: number
  discount?: number
  coupon_code?: string | null
  notes?: string
  createdAt: string
  updatedAt: string
}

const statusConfig = {
  pending: { 
    label: 'Pending', 
    icon: Clock, 
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200'
  },
  processing: { 
    label: 'Processing', 
    icon: Package, 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200'
  },
  shipped: { 
    label: 'Shipped', 
    icon: Truck, 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200'
  },
  delivered: { 
    label: 'Delivered', 
    icon: CheckCircle, 
    color: 'text-green-600', 
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200'
  },
  cancelled: { 
    label: 'Cancelled', 
    icon: XCircle, 
    color: 'text-red-600', 
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200'
  }
}

export default function OrdersPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  
  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewItem, setReviewItem] = useState<{ orderId: string; productId: string; productName: string; productImage: string } | null>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewComment, setReviewComment] = useState('')
  const [reviewImages, setReviewImages] = useState<string[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewedProducts, setReviewedProducts] = useState<Set<string>>(new Set())

  // Fetch user's orders
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (authStatus === 'authenticated' && session?.user?.email) {
      const fetchOrders = async () => {
        setLoading(true)
        try {
          // Fetch orders for the logged-in user by email
          const response = await fetch(`/api/orders?email=${encodeURIComponent(session.user?.email || '')}`)
          if (response.ok) {
            const data = await response.json()
            if (data.success) {
              setOrders(data.data || [])
            }
          }
        } catch (error) {
          console.error('Error fetching orders:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchOrders()
    }
  }, [authStatus, session, router])

  // Filter orders based on status
  const filteredOrders = useMemo(() => {
    if (activeFilter === 'all') return orders
    return orders.filter(order => order.status === activeFilter)
  }, [orders, activeFilter])

  // Get counts for each status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length }
    orders.forEach(order => {
      counts[order.status] = (counts[order.status] || 0) + 1
    })
    return counts
  }, [orders])

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Open review modal
  const openReviewModal = (orderId: string, item: OrderItem) => {
    const productId = item.productId || item.product_id
    setReviewItem({
      orderId,
      productId,
      productName: item.name,
      productImage: item.image || ''
    })
    setReviewRating(5)
    setReviewTitle('')
    setReviewComment('')
    setReviewImages([])
    setShowReviewModal(true)
  }

  // Handle image upload (convert to base64)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Limit to 3 images
    if (reviewImages.length >= 3) {
      Swal.fire({
        icon: 'warning',
        title: 'Limit Reached',
        text: 'You can upload maximum 3 images',
        confirmButtonColor: '#111827'
      })
      return
    }

    setUploadingImage(true)
    try {
      const file = files[0]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Please upload an image file',
          confirmButtonColor: '#111827'
        })
        return
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'Image must be less than 2MB',
          confirmButtonColor: '#111827'
        })
        return
      }

      // Convert to base64
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setReviewImages(prev => [...prev, base64])
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploadingImage(false)
      // Reset input
      e.target.value = ''
    }
  }

  // Remove uploaded image
  const removeImage = (index: number) => {
    setReviewImages(prev => prev.filter((_, i) => i !== index))
  }

  // Submit review
  const submitReview = async () => {
    if (!reviewItem) return

    setSubmittingReview(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productId: reviewItem.productId,
          orderId: reviewItem.orderId,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
          images: reviewImages
        })
      })

      const data = await response.json()

      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Review Submitted!',
          text: 'Thank you for your feedback.',
          confirmButtonColor: '#111827',
          timer: 2000,
          timerProgressBar: true
        })
        setShowReviewModal(false)
        // Mark this product as reviewed
        setReviewedProducts(prev => new Set([...prev, `${reviewItem.orderId}-${reviewItem.productId}`]))
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error || 'Failed to submit review',
          confirmButtonColor: '#111827'
        })
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to submit review. Please try again.',
        confirmButtonColor: '#111827'
      })
    } finally {
      setSubmittingReview(false)
    }
  }

  // Loading state
  if (authStatus === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-gray-600" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">No Orders Yet</h1>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t placed any orders yet. Start shopping and your orders will appear here!
            </p>
            <Link
              href="/allProducts"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Orders</h1>
              <p className="text-sm sm:text-base text-gray-500 truncate">Track and manage your orders ({orders.length} total)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
              {statusCounts[filter] ? (
                <span className="ml-2 text-xs opacity-70">
                  ({statusCounts[filter]})
                </span>
              ) : filter !== 'all' && (
                <span className="ml-2 text-xs opacity-70">(0)</span>
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <p className="text-gray-500">No {activeFilter} orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending
              const StatusIcon = status.icon

              return (
                <div
                  key={order._id}
                  className={`bg-white rounded-2xl shadow-sm border ${status.borderColor} overflow-hidden hover:shadow-md transition-shadow`}
                >
                  {/* Order Header */}
                  <div className="p-4 sm:p-6 border-b border-gray-100">
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${status.bgColor} rounded-lg sm:rounded-xl flex items-center justify-center shrink-0`}>
                          <StatusIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${status.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              {formatDate(order.order_date || order.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Banknote className="w-3 h-3 sm:w-4 sm:h-4" />
                              {order.payment_method}
                            </span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${status.bgColor} ${status.color} shrink-0`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                          ৳{order.total_amount?.toLocaleString('en-BD') || '0'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                      {order.items?.slice(0, 4).map((item, index) => (
                        <div key={index} className="flex items-center gap-2 sm:gap-3">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg overflow-hidden relative shrink-0">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 text-sm line-clamp-1">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity} × ৳{item.unit_price?.toLocaleString('en-BD')}
                            </p>
                            {/* Review Button for Delivered Orders */}
                            {order.status === 'delivered' && (
                              <button
                                onClick={() => openReviewModal(order._id, item)}
                                disabled={reviewedProducts.has(`${order._id}-${item.productId || item.product_id}`)}
                                className={`mt-1 flex items-center gap-1 text-xs font-medium transition-colors ${
                                  reviewedProducts.has(`${order._id}-${item.productId || item.product_id}`)
                                    ? 'text-green-600 cursor-default'
                                    : 'text-sky-600 hover:text-sky-700'
                                }`}
                              >
                                <Star className="w-3 h-3" />
                                {reviewedProducts.has(`${order._id}-${item.productId || item.product_id}`) ? 'Reviewed' : 'Write Review'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      {order.items?.length > 4 && (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-sm font-medium text-gray-500">+{order.items.length - 4}</span>
                        </div>
                      )}
                    </div>

                    {/* Shipping Address & Contact */}
                    <div className="flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                        <span className="flex-1">
                          {order.shipping_address?.street}, {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zip}
                        </span>
                      </div>
                      {order.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 shrink-0" />
                          <span>{order.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Order Notes */}
                    {order.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                        <strong>Note:</strong> {order.notes}
                      </div>
                    )}
                  </div>

                  {/* Order Footer */}
                  <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                    <div className="text-xs sm:text-sm text-gray-500 flex flex-wrap gap-x-3 gap-y-1">
                      <span>{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</span>
                      {order.shipping_cost !== undefined && order.shipping_cost > 0 && (
                        <span>• Shipping: ৳{order.shipping_cost.toLocaleString('en-BD')}</span>
                      )}
                      {order.discount !== undefined && order.discount > 0 && (
                        <span className="text-green-600">• Discount: -৳{order.discount.toLocaleString('en-BD')}</span>
                      )}
                    </div>
                   
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && reviewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowReviewModal(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              {reviewItem.productImage && (
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden relative shrink-0">
                  <Image
                    src={reviewItem.productImage}
                    alt={reviewItem.productName}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-gray-900">Write a Review</h3>
                <p className="text-sm text-gray-500 line-clamp-1">{reviewItem.productName}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= reviewRating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Title (Optional)
              </label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Summarize your experience"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            {/* Comment */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review (Optional)
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none"
              />
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Photos (Optional)
              </label>
              
              {/* Uploaded Images Preview */}
              {reviewImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {reviewImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={img}
                          alt={`Review image ${index + 1}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              {reviewImages.length < 3 && (
                <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-sky-400 hover:bg-sky-50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                      <span className="text-sm text-gray-500">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <ImagePlus className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Add Photo ({reviewImages.length}/3)
                      </span>
                    </>
                  )}
                </label>
              )}
              <p className="text-xs text-gray-400 mt-1">Max 2MB per image</p>
            </div>

            {/* Submit Button */}
            <button
              onClick={submitReview}
              disabled={submittingReview}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
            >
              {submittingReview ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
