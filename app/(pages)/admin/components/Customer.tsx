'use client'

import React, { useState } from 'react'
import { Search, Mail, Phone, Eye } from 'lucide-react'

const Customer = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+880 1712-345678', orders: 12, spent: '৳5,45,000', status: 'Active', joined: '2024-05-15' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', phone: '+880 1812-234567', orders: 8, spent: '৳3,25,000', status: 'Active', joined: '2024-07-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+880 1912-456789', orders: 15, spent: '৳7,85,000', status: 'Active', joined: '2024-03-10' },
    { id: 4, name: 'Emma Wilson', email: 'emma@example.com', phone: '+880 1612-567890', orders: 5, spent: '৳2,15,000', status: 'Inactive', joined: '2024-09-05' },
    { id: 5, name: 'David Brown', email: 'david@example.com', phone: '+880 1712-678901', orders: 3, spent: '৳1,45,000', status: 'Active', joined: '2024-11-12' },
    { id: 6, name: 'Lisa Anderson', email: 'lisa@example.com', phone: '+880 1812-789012', orders: 20, spent: '৳9,75,000', status: 'Active', joined: '2024-01-08' }
  ]

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
        <p className="text-sm text-gray-600 mt-1">Manage your customer database</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
        />
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                  {customer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {customer.status}
                  </span>
                </div>
              </div>
              <button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{customer.phone}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">Orders</p>
                <p className="text-lg font-bold text-gray-900">{customer.orders}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Spent</p>
                <p className="text-lg font-bold text-gray-900">{customer.spent}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Joined</p>
                <p className="text-sm font-medium text-gray-900">{customer.joined.split('-')[0]}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Customer