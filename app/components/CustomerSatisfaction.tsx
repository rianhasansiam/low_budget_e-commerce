'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Award, ThumbsUp, Users, Quote, ChevronRight, ArrowRight, ImageIcon } from 'lucide-react'

interface GalleryImage {
  _id: string
  image: string
  caption: string
  order: number
}

export default function CustomerSatisfaction() {
  const [showGallery, setShowGallery] = useState(false)
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch gallery images when popup opens
  const openGallery = async () => {
    setShowGallery(true)
    setLoading(true)
    try {
      const response = await fetch('/api/review-gallery')
      const data = await response.json()
      if (data.success) {
        setGalleryImages(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showGallery) return
      if (e.key === 'Escape') setShowGallery(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showGallery])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showGallery) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showGallery])

  return (
    <>
      {/* Banner Section */}
      <section className="py-10 bg-gradient-to-br from-sky-600 via-sky-500 to-cyan-500 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Floating Stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <Star
              key={i}
              className="absolute text-white/20 fill-white/20 animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${20 + Math.random() * 20}px`,
                height: `${20 + Math.random() * 20}px`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white">25,000+</p>
                <p className="text-xs md:text-sm text-white/80">Happy Customers</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 md:w-7 md:h-7 text-white fill-white" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white">4.9/5</p>
                <p className="text-xs md:text-sm text-white/80">Average Rating</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                  <ThumbsUp className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white">99%</p>
                <p className="text-xs md:text-sm text-white/80">Recommended</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white">100%</p>
                <p className="text-xs md:text-sm text-white/80">Original Products</p>
              </div>
            </div>

            {/* Main Banner Content */}
            <div 
              onClick={openGallery}
              className="bg-white/10 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 cursor-pointer hover:bg-white/15 transition-all duration-300 group border border-white/20"
            >
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                {/* Quote Icon */}
                <div className="shrink-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Quote className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
                    Customer Satisfaction is Our Priority
                  </h2>
                  <p className="text-white/90 text-sm md:text-base lg:text-lg mb-4">
                    Join thousands of happy customers who trust Engineers Gadget for quality products and exceptional service. See what our customers are saying about us!
                  </p>
                  <div className="inline-flex items-center gap-2 text-white font-medium text-sm md:text-base group-hover:underline">
                    <span>View Customer Review Gallery</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Preview Images Stack */}
                <div className="shrink-0 hidden lg:block">
                  <div className="relative w-32 h-24">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="absolute w-20 h-24 bg-white rounded-lg shadow-lg overflow-hidden"
                        style={{
                          left: `${i * 20}px`,
                          zIndex: 3 - i,
                          transform: `rotate(${(i - 1) * 5}deg)`,
                        }}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center">
                          <Star className="w-6 h-6 text-sky-400 fill-sky-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collage Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setShowGallery(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-5 md:px-8 md:py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">Customer Reviews</h3>
                    <p className="text-white/80 text-sm mt-1">Real feedback from our happy customers</p>
                  </div>
                  <button
                    onClick={() => setShowGallery(false)}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Collage Content */}
              <div className="p-4 md:p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : galleryImages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <ImageIcon className="w-10 h-10 text-gray-300" />
                    </div>
                    <p className="text-lg font-medium">No reviews yet</p>
                    <p className="text-sm text-gray-400 mt-1">Check back soon for customer reviews!</p>
                  </div>
                ) : (
                  /* Horizontal Collage Frame Grid - 2 rows */
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1 bg-gray-900 p-1 rounded-xl">
                    {/* Image Cells */}
                    {galleryImages.slice(0, 11).map((img, index) => (
                      <div key={img._id} className="relative group">
                        <div className="relative aspect-square overflow-hidden bg-gray-200">
                          <Image
                            src={img.image}
                            alt={img.caption || `Review ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        </div>
                      </div>
                    ))}

                    {/* View All Cell */}
                    <Link
                      href="/reviews"
                      onClick={() => setShowGallery(false)}
                      className="relative group"
                    >
                      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-sky-500 to-cyan-500 flex flex-col items-center justify-center text-white hover:from-sky-600 hover:to-cyan-600 transition-all">
                        {galleryImages.length > 11 && (
                          <span className="text-lg md:text-xl font-bold">+{galleryImages.length - 11}</span>
                        )}
                        <span className="text-xs md:text-sm font-medium flex items-center gap-1">
                          View All <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
