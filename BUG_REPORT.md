# Bug Report & Issues - Engineers Gadget

**Date:** January 13, 2026
**Status:** Comprehensive Site Analysis Completed

## 🔴 Critical Issues

### 1. Typo in Folder Name - "wilishlist" instead of "wishlist"
**Location:** `app/(pages)/wilishlist/`
**Impact:** High - Affects URL routing
**Files Affected:**
- Folder: `app/(pages)/wilishlist/`
- [app/components/Navbar.tsx](app/components/Navbar.tsx#L426) - Link to `/wilishlist`
- [app/(pages)/profile/ProfileClient.tsx](app/(pages)/profile/ProfileClient.tsx#L267) - Link to `/wilishlist`

**Description:** The wishlist folder is misspelled as "wilishlist", which creates inconsistency in routing.

**Solution:** Rename the folder from `wilishlist` to `wishlist` and update all references.

---

### 2. Environment Variables Not Documented
**Location:** Multiple files
**Impact:** High - Configuration issues for new developers
**Missing Documentation for:**
- `MONGODB_URI` - MongoDB connection string
- `MONGODB_DB_NAME` - Database name
- `NEXTAUTH_SECRET` - NextAuth secret key
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret
- `NEXT_PUBLIC_IMAGEBB_API_KEY` - Image upload API key (note: inconsistent naming)
- `NEXT_PUBLIC_IMGBB_API_KEY` - Alternative spelling (inconsistent)
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID` - Email service ID
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` - Email template ID
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` - Email public key
- `NEXT_PUBLIC_BASE_URL` - Base URL for the site
- `NEXT_PUBLIC_SITE_URL` - Site URL for SEO

**Solution:** Create a `.env.example` file with all required variables documented.

---

### 3. Inconsistent ImgBB API Key Variable Names
**Location:** Multiple components
**Impact:** Medium - Image upload may fail in some components
**Files Affected:**
- [app/(pages)/profile/ProfileClient.tsx](app/(pages)/profile/ProfileClient.tsx#L133) - Uses `NEXT_PUBLIC_IMGBB_API_KEY`
- [app/(pages)/admin/components/Settings.tsx](app/(pages)/admin/components/Settings.tsx#L167) - Uses `NEXT_PUBLIC_IMAGEBB_API_KEY`
- [app/(pages)/admin/components/Products.tsx](app/(pages)/admin/components/Products.tsx#L64) - Uses `NEXT_PUBLIC_IMAGEBB_API_KEY`
- [app/(pages)/admin/components/Categories.tsx](app/(pages)/admin/components/Categories.tsx#L70) - Uses `NEXT_PUBLIC_IMAGEBB_API_KEY`

**Description:** Two different environment variable names are being used for the ImgBB API key:
- `NEXT_PUBLIC_IMGBB_API_KEY` (correct spelling - 2 'B's)
- `NEXT_PUBLIC_IMAGEBB_API_KEY` (incorrect spelling - 3 'B's)

**Solution:** Standardize to `NEXT_PUBLIC_IMGBB_API_KEY` across all files.

---

## 🟡 Medium Priority Issues

### 4. Console.log Statements in Production Code
**Location:** [app/api/coupons/[id]/route.ts](app/api/coupons/[id]/route.ts)
**Impact:** Medium - Performance and security concern
**Lines:** 162, 167, 174

**Description:** Debug console.log statements are present in production code:
```typescript
console.log('Validating coupon:', couponCode);
console.log('Coupon not found in database');
console.log('Coupon found:', coupon);
```

**Solution:** Remove or replace with proper logging library.

---

### 5. Phone Number Validation Only for Bangladesh
**Location:** [app/(pages)/checkout/CheckoutClient.tsx](app/(pages)/checkout/CheckoutClient.tsx)
**Impact:** Medium - Limits international customers
**Line:** ~182

**Description:** Phone validation is hardcoded for Bangladesh numbers only:
```typescript
else if (!/^01[3-9]\d{8}$/.test(shippingForm.phone.replace(/\D/g, ''))) {
  errors.phone = 'Invalid Bangladesh phone number'
}
```

**Solution:** Consider adding country selection or more flexible phone validation.

---

### 6. No Input Validation for Product Stock
**Location:** [app/api/products/route.ts](app/api/products/route.ts#L69)
**Impact:** Medium - Could accept negative stock values

**Description:** The POST endpoint doesn't validate if stock is a positive number:
```typescript
stock: body.stock || 0,
```

**Solution:** Add validation to ensure stock is a non-negative number.

---

### 7. Missing Error Handling for MongoDB Connection Failure
**Location:** [lib/mongodb.ts](lib/mongodb.ts)
**Impact:** Medium - App may crash on connection failure

**Description:** While basic error checking exists, there's no graceful degradation if MongoDB connection fails after initial check.

**Solution:** Add connection retry logic and proper error boundaries.

---

## 🟢 Low Priority Issues / Improvements

### 8. No Rate Limiting on API Routes
**Location:** All API routes
**Impact:** Low - Potential for API abuse

**Description:** No rate limiting implemented on any API endpoints.

**Solution:** Implement rate limiting middleware for API routes, especially for authentication endpoints.

---

### 9. Missing TypeScript Strict Null Checks in Some Areas
**Location:** Various files
**Impact:** Low - Could cause runtime errors

**Description:** Optional chaining and null checks could be improved in several areas.

**Solution:** Review and add proper null checks where user data is accessed.

---

### 10. No Pagination on Categories API
**Location:** [app/api/categories/route.ts](app/api/categories/route.ts)
**Impact:** Low - Could be slow with many categories

**Description:** Categories endpoint returns all categories without pagination:
```typescript
const categories = await collection.find({}).toArray();
```

**Solution:** Add pagination if category count grows large.

---

### 11. Hardcoded Currency Symbol
**Location:** Multiple files
**Impact:** Low - Not internationalized

**Description:** Currency is hardcoded as "৳" (Bangladeshi Taka) throughout the application.

**Solution:** Consider adding currency configuration in settings.

---

### 12. Missing Image Alt Text Validation
**Location:** Multiple components using Next Image
**Impact:** Low - Accessibility concern

**Description:** Not all images have descriptive alt text.

**Solution:** Add validation to ensure all product images have alt text.

---

## ✅ Security Considerations

### 13. Password Hashing is Properly Implemented
**Location:** [app/api/users/route.ts](app/api/users/route.ts)
**Status:** ✅ Good
- Using bcryptjs with salt rounds of 12
- Passwords properly excluded from query results

---

### 14. Authentication is Properly Protected
**Location:** [lib/auth.ts](lib/auth.ts)
**Status:** ✅ Good
- Admin routes properly protected with `requireAdmin()`
- User routes protected with `requireAuth()`
- Proper role-based access control

---

### 15. MongoDB Injection Prevention
**Location:** All API routes
**Status:** ✅ Good
- Using MongoDB native driver with proper ObjectId validation
- Input sanitization in place

---

## 📊 Code Quality Observations

### Positive Points:
1. ✅ **Well-structured Next.js 16 application** with proper app router usage
2. ✅ **Redux Toolkit** properly implemented for state management
3. ✅ **TypeScript** used throughout with good type definitions
4. ✅ **Proper separation of concerns** - API routes, components, and utilities
5. ✅ **React Query (TanStack Query)** integrated for data fetching
6. ✅ **NextAuth** properly configured with Google OAuth and credentials
7. ✅ **Framer Motion** for smooth animations
8. ✅ **localStorage persistence** for cart and wishlist
9. ✅ **Proper error handling** in most API routes
10. ✅ **Responsive design** considerations

### Areas for Improvement:
1. ⚠️ Need comprehensive unit and integration tests
2. ⚠️ API documentation (consider adding Swagger/OpenAPI)
3. ⚠️ Performance monitoring and analytics
4. ⚠️ SEO optimization can be enhanced
5. ⚠️ Error logging service integration (e.g., Sentry)
6. ⚠️ Image optimization and CDN consideration
7. ⚠️ Database indexing strategy documentation

---

## 🎯 Immediate Action Items

1. **Fix typo:** Rename `wilishlist` folder to `wishlist`
2. **Standardize:** Fix ImgBB API key variable name inconsistency
3. **Document:** Create `.env.example` file
4. **Clean up:** Remove console.log statements from coupon validation
5. **Add validation:** Ensure product stock cannot be negative

---

## 📝 TypeScript Configuration Analysis

**Status:** ✅ Good
- Strict mode enabled
- Proper path aliases configured
- ES2017 target appropriate for the stack

---

## 🗄️ Database Schema Observations

**Collections Identified:**
- `users` - User accounts
- `allProducts` - Product catalog
- `categories` - Product categories
- `orders` - Customer orders
- `coupons` - Discount coupons
- `hero-slides` - Homepage carousel
- `colors` - Product color options
- `badges` - Product badges
- `settings` - Site settings

**Status:** ✅ Well-organized with proper indexing considerations

---

## 🚀 Performance Considerations

1. ✅ **Image optimization** enabled in next.config.ts
2. ✅ **Compression** enabled
3. ✅ **Cache headers** properly set for static assets
4. ✅ **ETags** generated for caching
5. ⚠️ Consider adding Redis for session/cache management
6. ⚠️ Consider implementing database connection pooling

---

## 📱 Mobile Responsiveness

**Status:** ✅ Appears well-structured with Tailwind CSS responsive utilities

---

## Summary

**Overall Assessment:** The codebase is well-structured and follows modern React/Next.js best practices. Most critical functionality is properly implemented with good security measures. The main issues are minor (typos, inconsistent naming) and can be easily fixed. No critical security vulnerabilities or major architectural problems were found.

**Recommended Priority:**
1. Fix the folder name typo (wilishlist → wishlist)
2. Standardize environment variable names
3. Create proper environment documentation
4. Remove debug console.log statements
5. Add comprehensive testing coverage
