'use client'

import React from 'react'
import { Tag, Plus, Edit2, Trash2 } from 'lucide-react'

const Categories = () => {
  const categories = [
    { id: 1, name: 'Cameras', icon: '📷', products: 245, bgColor: 'bg-violet-100' },
    { id: 2, name: 'Lenses', icon: '🔍', products: 389, bgColor: 'bg-blue-100' },
    { id: 3, name: 'Tripods', icon: '🎥', products: 167, bgColor: 'bg-green-100' },
    { id: 4, name: 'Lighting', icon: '💡', products: 134, bgColor: 'bg-yellow-100' },
    { id: 5, name: 'Audio', icon: '🎙️', products: 298, bgColor: 'bg-red-100' },
    { id: 6, name: 'Bags & Cases', icon: '🎒', products: 223, bgColor: 'bg-orange-100' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Organize your products into categories</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${category.bgColor} rounded-lg flex items-center justify-center text-2xl`}>
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Tag className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{category.products} products</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Categories