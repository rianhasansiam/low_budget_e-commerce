'use client'

import React from 'react'
import Image from 'next/image'
import { Smartphone, Apple, Play, QrCode, Download } from 'lucide-react'

export default function DownloadApp() {
  const qrCodeUrl = "https://i.ibb.co.com/6R8gZcBC/qrcode-298471541-333d20b3abca058856a0cf4d307e1fd3.png"
  
  return (
    <div className="bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-400 rounded-2xl p-3 md:p-4 shadow-lg">
      <div className="flex items-center justify-between gap-3 md:gap-6">
        
        {/* Left Side - Icon & Text */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h3 className="text-sm md:text-base font-bold text-white">Download Our App</h3>
            <p className="text-xs text-white/80">Shop faster & get exclusive deals</p>
          </div>
          <p className="sm:hidden text-xs font-semibold text-white">Get the App</p>
        </div>

        {/* Right Side - QR & Buttons */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* QR Code Card */}
          <div className="flex items-center gap-2 bg-white rounded-xl p-1.5 md:p-2 shadow-md">
            <div className="relative w-12 h-12 md:w-16 md:h-16 bg-white rounded-lg overflow-hidden">
              <Image
                src={qrCodeUrl}
                alt="Download App QR Code"
                fill
                className="object-contain"
              />
            </div>
            <div className="hidden md:block pr-2">
              <div className="flex items-center gap-1 text-sky-500 mb-0.5">
                <QrCode className="w-3 h-3" />
                <p className="text-[10px] font-medium">Scan QR</p>
              </div>
              <p className="text-xs font-bold text-gray-800">Download Now</p>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden lg:block w-px h-10 bg-white/30" />

          {/* App Store Buttons */}
          <div className="hidden sm:flex flex-col gap-1.5">
            <a 
              href="#" 
              className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-900 hover:bg-gray-800 rounded-lg transition-all hover:scale-105 shadow-md"
            >
              <Apple className="w-4 h-4 text-white" />
              <div className="text-left">
                <p className="text-[8px] text-gray-400 leading-none">Download on</p>
                <p className="text-xs font-semibold text-white leading-tight">App Store</p>
              </div>
            </a>
            <a 
              href="#" 
              className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-900 hover:bg-gray-800 rounded-lg transition-all hover:scale-105 shadow-md"
            >
              <Play className="w-4 h-4 text-white fill-white" />
              <div className="text-left">
                <p className="text-[8px] text-gray-400 leading-none">Get it on</p>
                <p className="text-xs font-semibold text-white leading-tight">Google Play</p>
              </div>
            </a>
          </div>

          {/* Mobile Download Button */}
          <a 
            href="#" 
            className="sm:hidden flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 text-sky-500" />
            <span className="text-xs font-bold text-gray-800">Download</span>
          </a>
        </div>
      </div>
    </div>
  )
}
