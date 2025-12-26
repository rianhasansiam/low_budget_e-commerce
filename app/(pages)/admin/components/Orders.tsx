'use client'

import React, { useState } from 'react'
import { Search, Download, Eye } from 'lucide-react'

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const orders = [
    { id: '#12345', customer: 'John Doe', email: 'john@example.com', product: 'Canon EOS R5', amount: '৳3,25,000', status: 'Completed', date: '2025-12-26', time: '10:30 AM' },
    { id: '#12346', customer: 'Sarah Smith', email: 'sarah@example.com', product: 'Sony A7 III', amount: '৳2,15,000', status: 'Processing', date: '2025-12-26', time: '09:15 AM' },
    { id: '#12347', customer: 'Mike Johnson', email: 'mike@example.com', product: 'Nikon Z6 II', amount: '৳1,95,000', status: 'Pending', date: '2025-12-25', time: '04:20 PM' },
    { id: '#12348', customer: 'Emma Wilson', email: 'emma@example.com', product: 'Fujifilm X-T4', amount: '৳1,45,000', status: 'Completed', date: '2025-12-25', time: '02:10 PM' },
    { id: '#12349', customer: 'David Brown', email: 'david@example.com', product: 'Canon RF 24-70mm', amount: '৳95,000', status: 'Cancelled', date: '2025-12-24', time: '11:45 AM' },
    { id: '#12350', customer: 'Lisa Anderson', email: 'lisa@example.com', product: 'Sony 85mm f/1.4', amount: '৳1,25,000', status: 'Processing', date: '2025-12-24', time: '08:30 AM' }
  ]

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
          <p className="text-sm text-gray-600 mt-1">Track and manage customer orders</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Order ID</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Customer</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Product</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-orange-600">{order.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.product}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{order.date}</p>
                      <p className="text-xs text-gray-500">{order.time}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Orders