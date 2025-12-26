'use client'

import React from 'react'
import { Percent, Copy, Plus } from 'lucide-react'

const Coupon = () => {
  const coupons = [
    { id: 1, code: 'WELCOME20', discount: '20%', minPurchase: '৳5,000', used: 342, limit: 1000, expiry: '2025-12-31', status: 'Active' },
    { id: 2, code: 'FLASH50', discount: '50%', minPurchase: '৳10,000', used: 156, limit: 500, expiry: '2025-06-30', status: 'Active' },
    { id: 3, code: 'FLAT1500', discount: '৳1,500', minPurchase: '৳7,500', used: 89, limit: 200, expiry: '2025-08-15', status: 'Active' },
    { id: 4, code: 'NEWYEAR40', discount: '40%', minPurchase: '৳12,000', used: 823, limit: 1500, expiry: '2025-01-31', status: 'Expired' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Manage promotional discount codes</p>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" />
          Create Coupon
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Percent className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-gray-900">{coupon.code}</span>
                    <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xl font-bold text-gray-900">{coupon.discount}</span>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                coupon.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {coupon.status}
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Min Purchase</span>
                <span className="font-medium text-gray-900">{coupon.minPurchase}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Usage</span>
                <span className="font-medium text-gray-900">{coupon.used} / {coupon.limit}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div 
                  className="bg-gray-900 h-1.5 rounded-full transition-all"
                  style={{ width: `${(coupon.used / coupon.limit) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Expiry Date</span>
                <span className="font-medium text-gray-900">{coupon.expiry}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Coupon