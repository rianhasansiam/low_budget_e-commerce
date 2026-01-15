'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface BannerSettings {
  message: string
  enabled: boolean
  backgroundColor: string
  textColor: string
}

const TopBanner = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [bannerSettings, setBannerSettings] = useState<BannerSettings | null>(null)
  const [shouldScroll, setShouldScroll] = useState(false)
  const textRef = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch banner settings
  useEffect(() => {
    const fetchBannerSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data?.topBanner) {
            setBannerSettings(data.data.topBanner)
          }
        }
      } catch (error) {
        console.error('Failed to fetch banner settings:', error)
      }
    }

    fetchBannerSettings()
  }, [])

  // Check if text needs scrolling
  useEffect(() => {
    const checkScroll = () => {
      if (textRef.current && containerRef.current) {
        const textWidth = textRef.current.scrollWidth
        const containerWidth = containerRef.current.clientWidth
        setShouldScroll(textWidth > containerWidth - 80) // 80px for close button space
      }
    }

    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [bannerSettings?.message])

  const handleClose = () => {
    setIsVisible(false)
  }

  // Don't render if not visible, not enabled, or no message
  if (!isVisible || !bannerSettings?.enabled || !bannerSettings?.message) {
    return null
  }

  return (
    <div
      className="relative w-full py-2 px-4 text-center text-sm font-medium overflow-hidden"
      style={{
        backgroundColor: bannerSettings.backgroundColor || '#1f2937',
        color: bannerSettings.textColor || '#ffffff',
      }}
    >
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto flex items-center justify-center overflow-hidden"
      >
        <div className={`flex-1 overflow-hidden ${shouldScroll ? 'mr-8' : ''}`}>
          {shouldScroll ? (
            <div className="animate-marquee whitespace-nowrap">
              <span ref={textRef} className="inline-block px-4">
                {bannerSettings.message}
              </span>
              <span className="inline-block px-4">
                {bannerSettings.message}
              </span>
            </div>
          ) : (
            <span ref={textRef} className="inline-block">
              {bannerSettings.message}
            </span>
          )}
        </div>

        <button
          onClick={handleClose}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Close banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}

export default TopBanner
