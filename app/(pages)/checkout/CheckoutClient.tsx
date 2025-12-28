'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ShoppingBag, 
  ArrowLeft, 
  Truck,
  Shield,
  Check,
  ChevronRight,
  Tag,
  X,
  Loader2,
  MapPin,
  Phone,
  Mail,
  User,
  Building,
  CheckCircle,
  Banknote
} from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { clearCart } from '@/lib/redux/slices/cartSlice'
import { useSession } from 'next-auth/react'
import { useAddData } from '@/lib/hooks/useAddData'
import Swal from 'sweetalert2'

interface ShippingForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  notes: string
}

interface CouponData {
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minPurchase: number
  maxDiscount: number | null
}

type PaymentMethod = 'cod'

// Order data interface for API
interface OrderData {
  _id?: string
  customer_name: string
  email: string
  phone: string
  shipping_address: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  items: Array<{
    product_id: string
    name: string
    quantity: number
    unit_price: number
    subtotal: number
    image?: string
  }>
  subtotal: number
  shipping_cost: number
  discount: number
  coupon_code: string | null
  total_amount: number
  payment_method: string
  notes: string
  status: string
}

export default function CheckoutClient() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const { items, totalPrice } = useAppSelector((state) => state.cart)
  
  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useAddData<OrderData>('orders', '/api/orders')

  // Form state
  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'Bangladesh',
    notes: ''
  })

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [formErrors, setFormErrors] = useState<Partial<ShippingForm>>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  
  // Shipping settings from admin
  const [shippingSettings, setShippingSettings] = useState({
    standardFee: 100,
    freeShippingThreshold: 5000,
    enableFreeShipping: true
  })

  // Fetch shipping settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        const data = await response.json()
        if (data.success && data.data?.shipping) {
          setShippingSettings(data.data.shipping)
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }
    fetchSettings()
  }, [])

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (session?.user) {
      const nameParts = session.user.name?.split(' ') || ['', '']
      setShippingForm(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: session.user?.email || ''
      }))
    }
  }, [session])

  // Calculate totals with dynamic shipping
  const subtotal = totalPrice
  const shippingCost = shippingSettings.enableFreeShipping && subtotal >= shippingSettings.freeShippingThreshold 
    ? 0 
    : shippingSettings.standardFee
  
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0
    
    if (appliedCoupon.discountType === 'percentage') {
      const discount = (subtotal * appliedCoupon.discountValue) / 100
      return appliedCoupon.maxDiscount ? Math.min(discount, appliedCoupon.maxDiscount) : discount
    }
    return appliedCoupon.discountValue
  }
  
  const discount = calculateDiscount()
  const total = subtotal + shippingCost - discount

  // Validate form
  const validateForm = (): boolean => {
    const errors: Partial<ShippingForm> = {}
    
    if (!shippingForm.firstName.trim()) errors.firstName = 'First name is required'
    if (!shippingForm.lastName.trim()) errors.lastName = 'Last name is required'
    if (!shippingForm.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingForm.email)) {
      errors.email = 'Invalid email format'
    }
    if (!shippingForm.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else if (!/^01[3-9]\d{8}$/.test(shippingForm.phone.replace(/\D/g, ''))) {
      errors.phone = 'Invalid Bangladesh phone number'
    }
    if (!shippingForm.address.trim()) errors.address = 'Address is required'
    if (!shippingForm.city.trim()) errors.city = 'City is required'
    if (!shippingForm.state.trim()) errors.state = 'State/Division is required'
    if (!shippingForm.zip.trim()) errors.zip = 'ZIP code is required'
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setShippingForm(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (formErrors[name as keyof ShippingForm]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }

    setIsApplyingCoupon(true)
    setCouponError('')

    try {
      const response = await fetch('/api/coupons')
      const data = await response.json()
      
      if (data.success) {
        const coupon = data.data.find(
          (c: CouponData & { isActive: boolean; expiryDate: string; usedCount: number; usageLimit: number }) => 
            c.code === couponCode.toUpperCase() && 
            c.isActive && 
            new Date(c.expiryDate) > new Date() &&
            c.usedCount < c.usageLimit
        )
        
        if (coupon) {
          if (subtotal < coupon.minPurchase) {
            setCouponError(`Minimum purchase of ৳${coupon.minPurchase.toLocaleString('en-BD')} required`)
          } else {
            setAppliedCoupon({
              code: coupon.code,
              discountType: coupon.discountType,
              discountValue: coupon.discountValue,
              minPurchase: coupon.minPurchase,
              maxDiscount: coupon.maxDiscount
            })
            Swal.fire({
              icon: 'success',
              title: 'Coupon Applied!',
              text: `You saved ৳${calculateDiscount().toLocaleString('en-BD')}`,
              timer: 2000,
              showConfirmButton: false
            })
          }
        } else {
          setCouponError('Invalid or expired coupon code')
        }
      }
    } catch {
      setCouponError('Failed to validate coupon')
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  // Remove coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponError('')
  }

  // Go to next step
  const handleNextStep = () => {
    if (currentStep === 1 && validateForm()) {
      setCurrentStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Go to previous step
  const handlePrevStep = () => {
    setCurrentStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Place order
  const handlePlaceOrder = async () => {
    if (!agreedToTerms) {
      Swal.fire({
        icon: 'warning',
        title: 'Terms Required',
        text: 'Please agree to the terms and conditions to proceed.'
      })
      return
    }

    try {
      const orderData: OrderData = {
        customer_name: `${shippingForm.firstName} ${shippingForm.lastName}`,
        email: shippingForm.email,
        phone: shippingForm.phone,
        shipping_address: {
          street: shippingForm.address,
          city: shippingForm.city,
          state: shippingForm.state,
          zip: shippingForm.zip,
          country: shippingForm.country
        },
        items: items.map(item => ({
          product_id: item.id,
          name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.price * item.quantity,
          image: item.image
        })),
        subtotal: subtotal,
        shipping_cost: shippingCost,
        discount: discount,
        coupon_code: appliedCoupon?.code || null,
        total_amount: total,
        payment_method: paymentMethod,
        notes: shippingForm.notes,
        status: 'pending'
      }

      await createOrder(orderData)

      // Clear cart
      dispatch(clearCart())

      // Show success
      await Swal.fire({
        icon: 'success',
        title: 'Order Placed Successfully!',
        html: `
          <div class="text-left">
            <p class="mb-2">Thank you for your order!</p>
            <p class="text-sm text-gray-500">A confirmation email has been sent to <strong>${shippingForm.email}</strong></p>
          </div>
        `,
        confirmButtonColor: '#111827',
        confirmButtonText: 'View Orders'
      })

      // Redirect to orders page
      router.push('/orders')

    } catch (error) {
      console.error('Order creation failed:', error)
      Swal.fire({
        icon: 'error',
        title: 'Order Failed',
        text: 'Something went wrong. Please try again.'
      })
    }
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-6">Add some products to your cart before checking out.</p>
          <Link
            href="/allProducts"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  const paymentMethods = [
    { id: 'cod', name: 'Cash on Delivery', icon: Banknote, description: 'Pay when you receive your order' }
  ]

  const divisions = [
    'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/addToCart" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Cart</span>
            </Link>
            
            <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
            
            {/* Steps Indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <div className={`w-8 h-0.5 ${currentStep >= 2 ? 'bg-gray-900' : 'bg-gray-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Shipping Information</h2>
                      <p className="text-sm text-gray-500">Enter your delivery details</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="firstName"
                          value={shippingForm.firstName}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 ${
                            formErrors.firstName ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="John"
                        />
                      </div>
                      {formErrors.firstName && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.firstName}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="lastName"
                          value={shippingForm.lastName}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 ${
                            formErrors.lastName ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="Doe"
                        />
                      </div>
                      {formErrors.lastName && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.lastName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={shippingForm.email}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 ${
                            formErrors.email ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="john@example.com"
                        />
                      </div>
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={shippingForm.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 ${
                            formErrors.phone ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="01XXXXXXXXX"
                        />
                      </div>
                      {formErrors.phone && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <textarea
                          name="address"
                          value={shippingForm.address}
                          onChange={handleInputChange}
                          rows={2}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 resize-none ${
                            formErrors.address ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="House #, Road #, Area"
                        />
                      </div>
                      {formErrors.address && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.address}</p>
                      )}
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingForm.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 ${
                          formErrors.city ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="Dhaka"
                      />
                      {formErrors.city && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.city}</p>
                      )}
                    </div>

                    {/* State/Division */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Division <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="state"
                        value={shippingForm.state}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 ${
                          formErrors.state ? 'border-red-500' : 'border-gray-200'
                        }`}
                      >
                        <option value="">Select Division</option>
                        {divisions.map(division => (
                          <option key={division} value={division}>{division}</option>
                        ))}
                      </select>
                      {formErrors.state && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.state}</p>
                      )}
                    </div>

                    {/* ZIP */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        ZIP Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="zip"
                        value={shippingForm.zip}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 ${
                          formErrors.zip ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="1000"
                      />
                      {formErrors.zip && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.zip}</p>
                      )}
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={shippingForm.country}
                        disabled
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                      />
                    </div>

                    {/* Order Notes */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Order Notes <span className="text-gray-400">(Optional)</span>
                      </label>
                      <textarea
                        name="notes"
                        value={shippingForm.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 resize-none"
                        placeholder="Special instructions for delivery..."
                      />
                    </div>
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={handleNextStep}
                    className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Continue to Payment
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <>
                {/* Shipping Summary */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Shipping Address</h3>
                        <p className="text-sm text-gray-500">
                          {shippingForm.firstName} {shippingForm.lastName}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handlePrevStep}
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="pl-13 text-sm text-gray-600">
                    <p>{shippingForm.address}</p>
                    <p>{shippingForm.city}, {shippingForm.state} {shippingForm.zip}</p>
                    <p>{shippingForm.phone}</p>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                        <Banknote className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
                        <p className="text-sm text-gray-500">Cash on Delivery</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon
                        return (
                          <button
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              paymentMethod === method.id
                                ? 'border-gray-900 bg-gray-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                paymentMethod === method.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                              }`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{method.name}</p>
                                <p className="text-xs text-gray-500">{method.description}</p>
                              </div>
                              {paymentMethod === method.id && (
                                <Check className="w-5 h-5 text-gray-900" />
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {/* Payment Info */}
                    {/* COD Info - Always shown since COD is the only option */}
                    <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100">
                      <div className="flex gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-800">Cash on Delivery</p>
                          <p className="text-sm text-green-700">
                            Please keep the exact amount ready. Our delivery agent will collect the payment upon delivery.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms & Place Order */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 mt-0.5"
                    />
                    <span className="text-sm text-gray-600">
                      I have read and agree to the{' '}
                      <Link href="/terms" className="text-orange-600 hover:underline">Terms & Conditions</Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link>
                    </span>
                  </label>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      onClick={handlePrevStep}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isCreatingOrder || !agreedToTerms}
                      className="flex-2 flex items-center justify-center gap-2 px-6 py-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {isCreatingOrder ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Place Order - ৳{total.toLocaleString('en-BD')}
                          <Check className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
                <p className="text-sm text-gray-500">{items.length} items</p>
              </div>

              {/* Items */}
              <div className="p-6 border-b border-gray-100 max-h-64 overflow-y-auto">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        )}
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                        <p className="text-sm text-gray-500">৳{item.price.toLocaleString('en-BD')} × {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        ৳{(item.price * item.quantity).toLocaleString('en-BD')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon */}
              <div className="p-6 border-b border-gray-100">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">{appliedCoupon.code}</span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="p-1 hover:bg-green-100 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-green-600" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase())
                            setCouponError('')
                          }}
                          placeholder="Coupon code"
                          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
                        />
                      </div>
                      <button
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon}
                        className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 disabled:bg-gray-300 transition-colors"
                      >
                        {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-sm text-red-500">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">৳{subtotal.toLocaleString('en-BD')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-900">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `৳${shippingCost.toLocaleString('en-BD')}`
                    )}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="text-green-600">-৳{discount.toLocaleString('en-BD')}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">
                      ৳{total.toLocaleString('en-BD')}
                    </span>
                  </div>
                  {shippingCost === 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      🎉 You qualify for free shipping!
                    </p>
                  )}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs">Secure</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Truck className="w-4 h-4" />
                    <span className="text-xs">Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs">Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
