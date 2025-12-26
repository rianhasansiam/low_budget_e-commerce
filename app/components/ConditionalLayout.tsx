'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Hide footer on admin pages but keep navbar
  const isAdminPage = pathname?.startsWith('/admin')

  return (
    <>
      <Navbar />
      {children}
      {!isAdminPage && <Footer />}
    </>
  )
}
