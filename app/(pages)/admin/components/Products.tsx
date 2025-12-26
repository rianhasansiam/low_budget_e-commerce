'use client'

import React, { useState } from 'react'
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react'
import Image from 'next/image'

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const products = [
    { id: 1, name: 'Canon EOS R5', category: 'Camera', price: '৳3,25,000', stock: 15, status: 'Active', image: 'https://images.unsplash.com/photo-1606980402072-a2c2c8a64a81?w=100' },
    { id: 2, name: 'Sony A7 III', category: 'Camera', price: '৳2,15,000', stock: 8, status: 'Active', image: 'https://images.unsplash.com/photo-1613521977138-6e8c2e7c1f6b?w=100' },
    { id: 3, name: 'Nikon Z6 II', category: 'Camera', price: '৳1,95,000', stock: 3, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1606980402072-a2c2c8a64a81?w=100' },
    { id: 4, name: 'Canon RF 24-70mm', category: 'Lens', price: '৳95,000', stock: 12, status: 'Active', image: 'https://images.unsplash.com/photo-1606986628255-e3e2ea42fa5a?w=100' },
    { id: 5, name: 'Sony 85mm f/1.4', category: 'Lens', price: '৳1,25,000', stock: 0, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1606986628255-e3e2ea42fa5a?w=100' },
    { id: 6, name: 'Manfrotto Tripod', category: 'Accessories', price: '৳15,000', stock: 25, status: 'Active', image: 'https://images.unsplash.com/photo-1617575521317-d2974f3b56d2?w=100' }
  ]

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                      />
                      <span className="font-medium text-gray-900 text-sm">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-900">{product.price}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{product.stock}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      product.status === 'Active' ? 'bg-green-100 text-green-700' :
                      product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
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

export default Products