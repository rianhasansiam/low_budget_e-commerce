'use client'

import React from 'react'
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'

const Dashboard = () => {
  const stats = [
    { icon: DollarSign, label: 'Total Revenue', value: '৳2,45,231', change: '+12.5%', positive: true, bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { icon: ShoppingCart, label: 'Total Orders', value: '1,234', change: '+8.2%', positive: true, bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
    { icon: Package, label: 'Products', value: '856', change: '+5.1%', positive: true, bgColor: 'bg-violet-50', iconColor: 'text-violet-600' },
    { icon: Users, label: 'Customers', value: '2,458', change: '-2.3%', positive: false, bgColor: 'bg-amber-50', iconColor: 'text-amber-600' }
  ]

  const recentOrders = [
    { id: '#12345', customer: 'John Doe', product: 'Canon EOS R5', amount: '৳3,25,000', status: 'Completed', date: '2025-12-26' },
    { id: '#12346', customer: 'Sarah Smith', product: 'Sony A7 III', amount: '৳2,15,000', status: 'Processing', date: '2025-12-26' },
    { id: '#12347', customer: 'Mike Johnson', product: 'Nikon Z6 II', amount: '৳1,95,000', status: 'Pending', date: '2025-12-25' },
    { id: '#12348', customer: 'Emma Wilson', product: 'Fujifilm X-T4', amount: '৳1,45,000', status: 'Completed', date: '2025-12-25' }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold ${
                stat.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Recent Orders</h3>
              <p className="text-sm text-gray-500 mt-0.5">Latest customer orders</p>
            </div>
            <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{order.customer}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{order.product}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-900">{order.amount}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard