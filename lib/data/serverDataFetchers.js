import { cache } from 'react'
import { 
  normalizeProducts, 
  normalizeCategories, 
  normalizeReviews,
  normalizeUsers
} from '@/lib/data/dataSchemas'
import { getCollection } from '@/lib/mongodb'

// 🚀 NEXT.JS 15 OPTIMIZATION: Server-side cached data fetching
// Fetches directly from database during build time to avoid localhost issues
const getProducts = cache(async () => {
  try {
    // During build time or server-side, fetch directly from database
    const productsCollection = await getCollection('products')
    const products = await productsCollection.find({}).toArray()
    
    // Convert MongoDB _id to string
    const productsWithStringId = products.map(product => ({
      ...product,
      _id: product._id.toString()
    }))
    
    return normalizeProducts(productsWithStringId)
  } catch (error) {
    console.error('Server: Failed to fetch products:', error)
    return []
  }
})

const getCategories = cache(async () => {
  try {
    // During build time or server-side, fetch directly from database
    const categoriesCollection = await getCollection('categories')
    const categories = await categoriesCollection.find({}).toArray()
    
    // Convert MongoDB _id to string
    const categoriesWithStringId = categories.map(category => ({
      ...category,
      _id: category._id.toString()
    }))
    
    return normalizeCategories(categoriesWithStringId)
  } catch (error) {
    console.error('Server: Failed to fetch categories:', error)
    return []
  }
})

const getReviews = cache(async () => {
  try {
    // During build time or server-side, fetch directly from database
    const reviewsCollection = await getCollection('reviews')
    const reviews = await reviewsCollection.find({}).toArray()
    
    // Convert MongoDB _id to string
    const reviewsWithStringId = reviews.map(review => ({
      ...review,
      _id: review._id.toString()
    }))
    
    return normalizeReviews(reviewsWithStringId)
  } catch (error) {
    console.error('Server: Failed to fetch reviews:', error)
    return []
  }
})

const getUsers = cache(async () => {
  try {
    // During build time or server-side, fetch directly from database
    const usersCollection = await getCollection('users')
    const users = await usersCollection.find({}).toArray()
    
    // Convert MongoDB _id to string
    const usersWithStringId = users.map(user => ({
      ...user,
      _id: user._id.toString()
    }))
    
    return normalizeUsers(usersWithStringId)
  } catch (error) {
    console.error('Server: Failed to fetch users:', error)
    return []
  }
})

// Server Actions for data revalidation
export async function revalidateProducts() {
  'use server'
  
  const { revalidateTag } = await import('next/cache')
  revalidateTag('products')
}

export async function revalidateCategories() {
  'use server'
  
  const { revalidateTag } = await import('next/cache')
  revalidateTag('categories')
}

export async function revalidateReviews() {
  'use server'
  
  const { revalidateTag } = await import('next/cache')
  revalidateTag('reviews')
}

export async function revalidateUsers() {
  'use server'
  
  const { revalidateTag } = await import('next/cache')
  revalidateTag('users')
}

// Main data fetcher that runs on server
export async function getHomePageData() {
  // 🚀 NEXT.JS 15: Parallel data fetching on server
  // Note: Users data removed - only needed for admin panel, not homepage
  const [products, categories, reviews] = await Promise.all([
    getProducts(),
    getCategories(),
    getReviews()
  ])

  return {
    products,
    categories, 
    reviews,
    // Computed data for better performance
    featuredProducts: products.filter(p => p.isInStock).slice(0, 8),
    activeCategories: categories.filter(c => c.isActive && c.hasProducts),
    approvedReviews: reviews.filter(r => r.isApproved).slice(0, 10),
    stats: {
      totalProducts: products.length,
      inStockProducts: products.filter(p => p.isInStock).length,
      totalCategories: categories.filter(c => c.isActive).length,
      totalReviews: reviews.filter(r => r.isApproved).length,
      averageRating: reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0
    }
  }
}