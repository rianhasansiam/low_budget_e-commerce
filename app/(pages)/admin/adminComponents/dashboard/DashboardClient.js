'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import axios from 'axios';
import Toast from './Toast';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Star,
  Package,
  ShoppingCart,
  Eye,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Plus,
  X,
  Trash2
} from 'lucide-react';

// StatCard Component
const StatCard = ({ title, value, change, trend, icon: Icon, color = "gray" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-${color}-100`}>
        <Icon className={`text-${color}-600`} size={24} />
      </div>
      <div className={`flex items-center text-sm font-medium ${
        trend === 'up' ? 'text-green-600' : 'text-red-600'
      }`}>
        {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span className="ml-1">{change}%</span>
      </div>
    </div>
    <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-900">
      {typeof value === 'number' && (title.includes('Revenue') || title.includes('Average Order')) ? `৳${value.toFixed(2)}` : value}
    </p>
  </motion.div>
);

const DashboardClient = ({ analytics, businessTracking, refetchBusiness }) => {
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [showRevenueDetails, setShowRevenueDetails] = useState(false);
  const [showInvestmentDetails, setShowInvestmentDetails] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddEntry = async (type) => {
    if (!formData.amount || !formData.description) {
      setToast({
        show: true,
        type: 'error',
        message: 'Please fill in all fields'
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post('/api/business-tracking', {
        type,
        amount: parseFloat(formData.amount),
        description: formData.description,
        date: formData.date
      });

      // Reset form and close modal
      setFormData({ amount: '', description: '', date: new Date().toISOString().split('T')[0] });
      setShowRevenueModal(false);
      setShowInvestmentModal(false);
      
      // Show success message
      setToast({
        show: true,
        type: 'success',
        message: response.data.message || `${type === 'revenue' ? 'Revenue' : 'Investment'} added successfully!`
      });
      
      // Refetch data
      if (refetchBusiness) {
        setTimeout(() => refetchBusiness(), 500);
      }
    } catch (error) {
      console.error('Error adding entry:', error);
      console.error('Error response:', error.response?.data);
      setToast({
        show: true,
        type: 'error',
        message: error.response?.data?.error || 'Failed to add entry. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Revenue Modal */}
      {showRevenueModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add Revenue</h3>
              <button onClick={() => setShowRevenueModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (৳)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Product sales"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => handleAddEntry('revenue')}
                disabled={submitting}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Revenue'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Investment Modal */}
      {showInvestmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add Investment</h3>
              <button onClick={() => setShowInvestmentModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (৳)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., New equipment"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => handleAddEntry('investment')}
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Investment'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-800 to-black rounded-2xl p-4 sm:p-6 lg:p-8 text-white"
      >
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Welcome to Digicam Market Admin Dashboard</h1>
        <p className="text-gray-300 text-sm sm:text-base lg:text-lg">Here&apos;s what&apos;s happening with your camera business today.</p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center mt-4 space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center text-gray-300 text-sm">
            <Calendar className="mr-2 flex-shrink-0" size={16} />
            <span className="truncate">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center text-gray-300 text-sm">
            <Activity className="mr-2 flex-shrink-0" size={16} />
            <span>All systems operational</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Revenue"
          value={analytics.overview.totalRevenue.value}
          change={analytics.overview.totalRevenue.change}
          trend={analytics.overview.totalRevenue.trend}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={analytics.overview.totalOrders.value}
          change={analytics.overview.totalOrders.change}
          trend={analytics.overview.totalOrders.trend}
          icon={ShoppingBag}
          color="gray"
        />
        <StatCard
          title="Total Customers"
          value={analytics.overview.totalCustomers.value}
          change={analytics.overview.totalCustomers.change}
          trend={analytics.overview.totalCustomers.trend}
          icon={Users}
          color="gray"
        />
        <StatCard
          title="Average Order"
          value={analytics.overview.averageOrder.value}
          change={analytics.overview.averageOrder.change}
          trend={analytics.overview.averageOrder.trend}
          icon={Star}
          color="gray"
        />
      </div>

      {/* Business Tracking Cards - Revenue & Investment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Revenue Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Total Revenue</p>
              <p className="text-4xl font-bold">৳{businessTracking?.totalRevenue?.toFixed(2) || '0.00'}</p>
              <p className="text-green-100 text-xs mt-1">{businessTracking?.entries?.filter(e => e.type === 'revenue').length || 0} entries</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <TrendingUp size={28} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowRevenueModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={18} />
              Add
            </button>
            <button
              onClick={() => setShowRevenueDetails(true)}
              className="bg-white/20 hover:bg-white/30 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Eye size={18} />
              View
            </button>
          </div>
        </motion.div>

        {/* Investment Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Investment</p>
              <p className="text-4xl font-bold">৳{businessTracking?.totalInvestment?.toFixed(2) || '0.00'}</p>
              <p className="text-blue-100 text-xs mt-1">{businessTracking?.entries?.filter(e => e.type === 'investment').length || 0} entries</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <DollarSign size={28} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowInvestmentModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={18} />
              Add
            </button>
            <button
              onClick={() => setShowInvestmentDetails(true)}
              className="bg-white/20 hover:bg-white/30 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Eye size={18} />
              View
            </button>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Revenue Overview</h3>
            <BarChart3 className="text-gray-700" size={24} />
          </div>
          <div className="space-y-4">
            {analytics.monthlyData.map((data, index) => (
              <div key={data.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{data.month}</span>
                <div className="flex items-center space-x-4 flex-1 mx-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-t from-gray-700 to-gray-900 rounded-t-lg w-8 min-h-4"
                      style={{ width: `${(data.revenue / 70000) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900">৳{(data.revenue / 1000).toFixed(0)}k</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Top Products</h3>
            <Package className="text-gray-700" size={24} />
          </div>
          <div className="space-y-4">
            {analytics.topProducts.map((product, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                    unoptimized={true}
                    onError={(e) => {
                      e.target.src = '/default-product.png';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.sales} sales</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-sm">৳{product.revenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Sales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Recent Sales</h3>
          <ShoppingCart className="text-gray-700 flex-shrink-0" size={20} />
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-600 text-sm">Order ID</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-600 text-sm">Customer</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-600 text-sm">Amount</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-600 text-sm">Status</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-600 text-sm hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentSales.map((sale, index) => (
                  <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-900 text-sm">{sale.id}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-sm truncate max-w-[120px] sm:max-w-none">{sale.customer}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-900 text-sm">৳{sale.amount.toFixed(2)}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                        sale.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        sale.status === 'shipped' ? 'bg-gray-100 text-gray-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-500 text-sm hidden sm:table-cell">{sale.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
      >
        <button className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-4 sm:p-6 text-white text-left hover:from-green-700 hover:to-green-800 transition-all">
          <Package className="mb-3 sm:mb-4 flex-shrink-0" size={24} />
          <h3 className="text-lg sm:text-xl font-bold mb-2">Add New Product</h3>
          <p className="text-green-100 mb-3 sm:mb-4 text-sm sm:text-base">Expand your inventory</p>
          <button className="bg-white text-green-700 px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors text-sm sm:text-base">
            Add Product
          </button>
        </button>
        
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl p-4 sm:p-6 text-white">
          <ShoppingCart className="mb-3 sm:mb-4 flex-shrink-0" size={24} />
          <h3 className="text-lg sm:text-xl font-bold mb-2">View Orders</h3>
          <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">Manage pending orders</p>
          <button className="bg-white text-gray-800 px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base">
            View Orders
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl p-4 sm:p-6 text-white">
          <Users className="mb-3 sm:mb-4 flex-shrink-0" size={24} />
          <h3 className="text-lg sm:text-xl font-bold mb-2">Customer Analytics</h3>
          <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">View customer insights</p>
          <button className="bg-white text-gray-800 px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base">
            View Analytics
          </button>
        </div>
      </motion.div> */}

      {/* Revenue Details Modal */}
      {showRevenueDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8"
          >
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Revenue Details</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Total: ৳{businessTracking?.totalRevenue?.toFixed(2) || '0.00'} • {businessTracking?.entries?.filter(e => e.type === 'revenue').length || 0} entries
                </p>
              </div>
              <button
                onClick={() => setShowRevenueDetails(false)}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3">
              {businessTracking?.entries?.filter(e => e.type === 'revenue').length > 0 ? (
                businessTracking.entries
                  .filter(e => e.type === 'revenue')
                  .map((entry, index) => (
                    <motion.div
                      key={entry._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="bg-green-500 text-white p-2 rounded-lg">
                              <TrendingUp size={20} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-lg">
                                ৳{parseFloat(entry.amount).toFixed(2)}
                              </h4>
                              <p className="text-gray-700 mt-1">{entry.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  {new Date(entry.date).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </span>
                                {entry.createdBy && (
                                  <span className="text-xs bg-green-200 px-2 py-1 rounded">
                                    {entry.createdBy}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
              ) : (
                <div className="text-center py-12">
                  <TrendingUp size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">No revenue entries yet</p>
                  <p className="text-gray-400 text-sm mt-2">Click &quot;Add&quot; to create your first revenue entry</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Investment Details Modal */}
      {showInvestmentDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8"
          >
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Investment Details</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Total: ৳{businessTracking?.totalInvestment?.toFixed(2) || '0.00'} • {businessTracking?.entries?.filter(e => e.type === 'investment').length || 0} entries
                </p>
              </div>
              <button
                onClick={() => setShowInvestmentDetails(false)}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3">
              {businessTracking?.entries?.filter(e => e.type === 'investment').length > 0 ? (
                businessTracking.entries
                  .filter(e => e.type === 'investment')
                  .map((entry, index) => (
                    <motion.div
                      key={entry._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-500 text-white p-2 rounded-lg">
                              <DollarSign size={20} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-lg">
                                ৳{parseFloat(entry.amount).toFixed(2)}
                              </h4>
                              <p className="text-gray-700 mt-1">{entry.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  {new Date(entry.date).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </span>
                                {entry.createdBy && (
                                  <span className="text-xs bg-blue-200 px-2 py-1 rounded">
                                    {entry.createdBy}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
              ) : (
                <div className="text-center py-12">
                  <DollarSign size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">No investment entries yet</p>
                  <p className="text-gray-400 text-sm mt-2">Click &quot;Add&quot; to create your first investment entry</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast Notifications */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default DashboardClient;