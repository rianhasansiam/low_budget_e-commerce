'use client'

import React, { useState } from 'react'
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, Percent, Bell, Search, ChevronDown, LogOut, Settings } from 'lucide-react'
import Dashboard from './components/Dashboard'
import Products from './components/Products'
import Orders from './components/Orders'
import Customer from './components/Customer'
import Categories from './components/Categories'
import Coupon from './components/Coupon'

type TabType = 'dashboard' | 'products' | 'orders' | 'customers' | 'categories' | 'coupons'

const menuItems = [
  { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products' as TabType, label: 'Products', icon: Package },
  { id: 'orders' as TabType, label: 'Orders', icon: ShoppingCart },
  { id: 'customers' as TabType, label: 'Customers', icon: Users },
  { id: 'categories' as TabType, label: 'Categories', icon: Tag },
  { id: 'coupons' as TabType, label: 'Coupons', icon: Percent }
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-gray-900 flex flex-col fixed h-screen">
        {/* Logo */}
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-gray-900 font-bold text-lg">DC</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Digicam</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">Menu</p>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-white text-gray-900'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Admin Profile */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
            <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@digicam.com</p>
            </div>
            <LogOut className="w-4 h-4 text-gray-500 hover:text-red-400 cursor-pointer" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Page Title */}
              <div>
                <h1 className="text-xl font-bold text-gray-900 capitalize">{activeTab}</h1>
                <p className="text-sm text-gray-500">Manage your {activeTab}</p>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-64 pl-9 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                  />
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Settings */}
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'products' && <Products />}
          {activeTab === 'orders' && <Orders />}
          {activeTab === 'customers' && <Customer />}
          {activeTab === 'categories' && <Categories />}
          {activeTab === 'coupons' && <Coupon />}
        </div>
      </main>
    </div>
  )
}