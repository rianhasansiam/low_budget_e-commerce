/**
 * Product Schema Validation
 * Ensures all products match the exact database structure
 */

// Product schema definition matching MongoDB structure
export const PRODUCT_SCHEMA = {
  _id: 'ObjectId',          // MongoDB ObjectId
  name: 'string',           // Product name (required)
  category: 'string',       // Category name (required)
  style: 'string',          // Camera type (DSLR, Mirrorless, etc.)
  price: 'number',          // Current price (required)
  originalPrice: 'number|null', // Original price (optional)
  stock: 'number',          // Stock quantity (required)
  shortDescription: 'string', // Brief description (required)
  description: 'string',    // Full description (required)
  images: 'array',          // Array of image URLs (required)
  colors: 'array',          // Array of body colors (required)
  sizes: 'array',           // Array of sensor types (required)
  image: 'string',          // Primary image URL (auto-set from images[0])
  color: 'string',          // Primary color (auto-set from colors[0])
  createdAt: 'date',        // Creation timestamp
  updatedAt: 'date'         // Last update timestamp (optional)
};

// Required fields for product creation
export const REQUIRED_PRODUCT_FIELDS = [
  'name',
  'category',
  'style',
  'price',
  'stock',
  'shortDescription',
  'description',
  'images',
  'colors',
  'sizes'
];

// Camera types for style field
export const CAMERA_TYPES = [
  'DSLR',
  'Mirrorless',
  'Point & Shoot',
  'Action Camera',
  'Film Camera',
  'Instant Camera'
];

// Camera types (condition) for sizes field
export const SENSOR_TYPES = [
  'Used',
  'Used Like New',
  'New'
];

// Camera body colors
export const BODY_COLORS = [
  'Black',
  'Silver',
  'Gray',
  'White',
  'Gold',
  'Blue',
  'Red',
  'Bronze'
];

/**
 * Validate product data against schema
 * @param {Object} product - Product object to validate
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
export function validateProduct(product) {
  const errors = [];

  // Check required fields
  REQUIRED_PRODUCT_FIELDS.forEach(field => {
    if (!product[field] || (typeof product[field] === 'string' && !product[field].trim())) {
      errors.push(`Field '${field}' is required`);
    }
  });

  // Validate types
  if (product.name && typeof product.name !== 'string') {
    errors.push('Field \'name\' must be a string');
  }

  if (product.category && typeof product.category !== 'string') {
    errors.push('Field \'category\' must be a string');
  }

  if (product.style && typeof product.style !== 'string') {
    errors.push('Field \'style\' must be a string');
  }

  if (product.price !== undefined && (isNaN(product.price) || Number(product.price) < 0)) {
    errors.push('Field \'price\' must be a positive number');
  }

  if (product.originalPrice !== undefined && product.originalPrice !== null && 
      (isNaN(product.originalPrice) || Number(product.originalPrice) < 0)) {
    errors.push('Field \'originalPrice\' must be a positive number or null');
  }

  if (product.stock !== undefined && (isNaN(product.stock) || Number(product.stock) < 0)) {
    errors.push('Field \'stock\' must be a non-negative number');
  }

  // Validate arrays
  if (product.images && (!Array.isArray(product.images) || product.images.length === 0)) {
    errors.push('Field \'images\' must be a non-empty array');
  }

  if (product.colors && (!Array.isArray(product.colors) || product.colors.length === 0)) {
    errors.push('Field \'colors\' must be a non-empty array');
  }

  if (product.sizes && (!Array.isArray(product.sizes) || product.sizes.length === 0)) {
    errors.push('Field \'sizes\' must be a non-empty array');
  }

  // Validate image URLs
  if (Array.isArray(product.images)) {
    product.images.forEach((img, index) => {
      if (typeof img !== 'string' || !img.trim()) {
        errors.push(`Image at index ${index} must be a valid URL string`);
      }
    });
  }

  // Validate descriptions
  if (product.shortDescription && product.shortDescription.length > 200) {
    errors.push('Field \'shortDescription\' must not exceed 200 characters');
  }

  // Check if originalPrice is less than price
  if (product.originalPrice && product.price && 
      Number(product.originalPrice) < Number(product.price)) {
    errors.push('Field \'originalPrice\' must be greater than or equal to \'price\'');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize product data before saving
 * @param {Object} product - Product object to sanitize
 * @returns {Object} - Sanitized product object
 */
export function sanitizeProduct(product) {
  return {
    name: product.name?.trim() || '',
    category: product.category?.trim() || '',
    style: product.style?.trim() || '',
    price: Number(product.price) || 0,
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    stock: Number(product.stock) || 0,
    shortDescription: product.shortDescription?.trim() || '',
    description: product.description?.trim() || '',
    images: Array.isArray(product.images) ? product.images.filter(img => img && img.trim()) : [],
    image: product.image || (Array.isArray(product.images) && product.images[0]) || '',
    colors: Array.isArray(product.colors) ? product.colors.filter(c => c && c.trim()) : [],
    color: product.color || (Array.isArray(product.colors) && product.colors[0]) || '',
    sizes: Array.isArray(product.sizes) ? product.sizes.filter(s => s && s.trim()) : [],
    createdAt: product.createdAt || new Date(),
    updatedAt: product.updatedAt || null
  };
}

/**
 * Prepare product data for database insertion
 * @param {Object} product - Product object from form
 * @returns {Object} - Database-ready product object
 */
export function prepareProductForDB(product) {
  const sanitized = sanitizeProduct(product);
  
  // Ensure primary image and color are set from arrays
  if (!sanitized.image && sanitized.images.length > 0) {
    sanitized.image = sanitized.images[0];
  }
  
  if (!sanitized.color && sanitized.colors.length > 0) {
    sanitized.color = sanitized.colors[0];
  }
  
  return sanitized;
}

/**
 * Example product matching schema
 */
export const EXAMPLE_PRODUCT = {
  "_id": "68e2ab6cb43f7f5c1b6425d9",
  "name": "Canon EOS R5",
  "category": "Mirrorless Cameras",
  "style": "Mirrorless",
  "price": 389900,
  "originalPrice": 450000,
  "stock": 15,
  "shortDescription": "Professional full-frame mirrorless camera with 45MP sensor and 8K video",
  "description": "The Canon EOS R5 sets a new standard for mirrorless cameras with its 45-megapixel full-frame sensor, 8K video recording, and advanced autofocus system. Perfect for professional photographers and videographers.",
  "images": [
    "https://i.ibb.co/example1.jpg",
    "https://i.ibb.co/example2.jpg",
    "https://i.ibb.co/example3.jpg"
  ],
  "colors": [
    "Black",
    "Silver"
  ],
  "sizes": [
    "New"
  ],
  "image": "https://i.ibb.co/example1.jpg",
  "color": "Black",
  "createdAt": "2025-10-05T17:31:24.704Z"
};

export default EXAMPLE_PRODUCT;
