# 🛍️ DigiCam Market - Modern E-Commerce Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-6.19.0-green?style=for-the-badge&logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

A full-stack, production-ready e-commerce platform built with Next.js 15, featuring secure authentication, real-time cart management, admin dashboard, and comprehensive API security.

[Live Demo](https://digicammarket.com) • [Report Bug](https://github.com/rianhasansiam/digicam/issues) • [Request Feature](https://github.com/rianhasansiam/digicam/issues)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🛒 Shopping Experience
- **Product Catalog** - Browse products with advanced filtering and search
- **Product Details** - Detailed product pages with reviews and ratings
- **Shopping Cart** - Real-time cart with size/color variants
- **Wishlist** - Save favorite products for later
- **Checkout** - Streamlined checkout process with order summary

### 👤 User Management
- **Authentication** - Secure email/password and Google OAuth sign-in
- **User Profiles** - Manage personal information and addresses
- **Order History** - Track current and past orders
- **Role-Based Access** - User and Admin roles with different permissions

### 🎛️ Admin Dashboard
- **Product Management** - Create, update, and delete products
- **Order Management** - View and manage customer orders
- **User Management** - Manage users and assign roles
- **Category Management** - Organize products by categories
- **Coupon System** - Create and manage discount coupons
- **Analytics** - View sales statistics and insights
- **Live Chat Support** - Real-time customer support chat system

### 🔒 Security Features
- **CORS Protection** - Cross-origin resource sharing control
- **Origin Verification** - Request origin validation
- **Role-Based Authorization** - Protected API routes
- **Security Headers** - XSS, Clickjacking, CSP protection
- **Password Hashing** - Secure bcrypt password encryption
- **Environment-Aware** - Different security levels for dev/prod

### 💬 Real-Time Features
- **Live Chat System** - WebSocket-powered customer support chat
- **Instant Messaging** - Real-time message delivery between customers and admin
- **Typing Indicators** - See when someone is typing
- **Online Status** - Know when admin is available
- **Unread Counts** - Track unread messages with badge notifications
- **Message History** - Persistent chat conversations stored in database

### ⚡ Performance
- **Server-Side Rendering** - Fast initial page loads
- **Image Optimization** - Automatic AVIF/WebP conversion
- **Code Splitting** - Optimized bundle sizes
- **Caching Strategy** - React Query for efficient data fetching
- **Debounced Operations** - Optimized localStorage writes

---

## 🚀 Tech Stack

### Frontend
- **Framework**: [Next.js 15.5.3](https://nextjs.org/) (App Router)
- **UI Library**: [React 19.1.0](https://react.dev/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit 2.9.0](https://redux-toolkit.js.org/)
- **Data Fetching**: [TanStack Query 5.89.0](https://tanstack.com/query/latest)
- **Animations**: [Framer Motion 12.23.12](https://www.framer.com/motion/)
- **Icons**: [Lucide React 0.544.0](https://lucide.dev/) & [React Icons 5.5.0](https://react-icons.github.io/react-icons/)
- **Forms**: [SweetAlert2 11.23.0](https://sweetalert2.github.io/)

### Backend
- **Runtime**: [Node.js 18+](https://nodejs.org/)
- **Database**: [MongoDB 6.19.0](https://www.mongodb.com/)
- **Authentication**: [NextAuth.js 5.0.0](https://next-auth.js.org/)
- **API**: Next.js API Routes (RESTful)
- **WebSocket**: [Socket.io 4.8.1](https://socket.io/) - Real-time communication
- **Password Hashing**: [bcryptjs 3.0.2](https://github.com/dcodeIO/bcrypt.js)

### Additional Tools
- **HTTP Client**: [Axios 1.12.2](https://axios-http.com/)
- **Email Service**: [EmailJS 4.4.1](https://www.emailjs.com/)
- **Image Upload**: [ImageBB API](https://api.imgbb.com/)
- **PDF Generation**: [jsPDF 3.0.3](https://github.com/parallax/jsPDF) & [html2canvas 1.4.1](https://html2canvas.hertzen.com/)

---

## 🎯 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **MongoDB** Atlas account or local MongoDB instance
- **Google OAuth** credentials (optional, for Google sign-in)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rianhasansiam/digicam.git
   cd digicam
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.local.example .env.local
   ```
   
   See [Environment Configuration](#-environment-configuration) for details.

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3001](http://localhost:3001) in your browser.

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

---

## 🔧 Environment Configuration

### Development Mode

Create `.env.local` with the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL=http://localhost:3001

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
MONGODB_DB=digicam

# Google OAuth (Optional)
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# ImageBB API (For image uploads)
NEXT_PUBLIC_IMAGEBB_API_KEY=your-imgbb-api-key

# EmailJS Configuration (For contact form)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your-service-id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your-template-id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your-public-key

# Environment Mode
NODE_ENV=development
```

### Production Mode

Update the following for production:

```bash
NEXTAUTH_URL=https://yourdomain.com
NODE_ENV=production
```

> 📖 **Detailed Guide**: See [ENVIRONMENT_CONFIG_GUIDE.md](ENVIRONMENT_CONFIG_GUIDE.md) for complete setup instructions.

---

## 📁 Project Structure

```
digicam/
├── app/                          # Next.js App Router
│   ├── (pages)/                  # Page routes
│   │   ├── about/               # About page
│   │   ├── addToCart/           # Cart page
│   │   ├── admin/               # Admin dashboard
│   │   ├── allProducts/         # Products listing
│   │   ├── checkout/            # Checkout page
│   │   ├── contact/             # Contact page
│   │   ├── login/               # Login page
│   │   ├── signup/              # Signup page
│   │   ├── productDetails/      # Product details
│   │   ├── profile/             # User profile
│   │   └── ...
│   ├── api/                     # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   ├── products/            # Product CRUD
│   │   ├── orders/              # Order management
│   │   ├── users/               # User management
│   │   ├── categories/          # Category management
│   │   ├── reviews/             # Review system
│   │   ├── coupons/             # Coupon management
│   │   └── ...
│   ├── componets/               # Shared components
│   │   ├── navbar/              # Navigation
│   │   ├── footer/              # Footer
│   │   ├── cards/               # Product cards
│   │   ├── hero/                # Hero section
│   │   └── ...
│   ├── redux/                   # Redux store
│   │   ├── store.js             # Redux configuration
│   │   ├── slice.js             # Cart & wishlist state
│   │   └── ...
│   ├── layout.js                # Root layout
│   ├── page.js                  # Homepage
│   └── globals.css              # Global styles
├── lib/                         # Utilities & configs
│   ├── actions/                 # Server actions
│   ├── cache/                   # Server-side caching
│   ├── data/                    # Data schemas
│   ├── hooks/                   # Custom React hooks
│   ├── providers/               # Context providers
│   ├── queries/                 # React Query configs
│   ├── utils/                   # Utility functions
│   ├── auth.js                  # NextAuth configuration
│   ├── mongodb.js               # Database connection
│   ├── security.js              # Security utilities
│   └── ...
├── public/                      # Static assets
│   ├── logo.png
│   ├── hero.jpg
│   └── ...
├── middleware.js                # Next.js middleware (CORS, security)
├── next.config.mjs              # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── package.json                 # Dependencies
└── README.md                    # This file
```

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login with credentials | No |
| GET | `/api/auth/user-status` | Get current user | Yes |

### Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products | No |
| POST | `/api/products` | Create product | Admin |
| GET | `/api/products/[id]` | Get product by ID | No |
| PUT | `/api/products/[id]` | Update product | Admin |
| DELETE | `/api/products/[id]` | Delete product | Admin |

### Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/orders` | Get all orders | Admin |
| POST | `/api/orders` | Create order | User |
| GET | `/api/orders/[id]` | Get order by ID | User/Admin |
| PUT | `/api/orders/[id]` | Update order | Admin |
| DELETE | `/api/orders/[id]` | Delete order | Admin |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users` | Get all users | Admin |
| POST | `/api/users` | Create user | No |
| GET | `/api/users/[id]` | Get user by ID | User/Admin |
| PUT | `/api/users/[id]` | Update user | User/Admin |
| DELETE | `/api/users/[id]` | Delete user | Admin |

> 📖 **Full Documentation**: See [BACKEND_ROUTES_README.md](BACKEND_ROUTES_README.md) for complete API documentation.

---

## 🔒 Security

This project implements multiple layers of security:

### 🛡️ CORS Protection
- Environment-aware origin validation
- Blocks unauthorized cross-origin requests
- Configurable allowed domains

### 🔐 Authentication & Authorization
- JWT-based session management
- Role-based access control (User/Admin)
- Secure password hashing with bcrypt
- Google OAuth integration

### 🔒 Security Headers
- `X-Frame-Options: DENY` (Clickjacking protection)
- `X-Content-Type-Options: nosniff` (MIME sniffing protection)
- `X-XSS-Protection: 1; mode=block` (XSS protection)
- `Content-Security-Policy` (CSP)
- `Strict-Transport-Security` (HTTPS enforcement)

### 🚦 API Protection
- Origin verification on all routes
- Method validation
- Input sanitization
- Rate limiting ready

> 📖 **Security Details**: See [API_SECURITY.md](API_SECURITY.md) and [SECURITY_QUICK_START.md](SECURITY_QUICK_START.md)

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

3. **Update environment variables**
   ```bash
   NEXTAUTH_URL=https://your-domain.vercel.app
   NODE_ENV=production
   ```

### Deploy to VPS

1. **Clone and install**
   ```bash
   git clone your-repo
   cd digicam
   npm install
   ```

2. **Build the application**
   ```bash
   npm run build
   ```

3. **Start with PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "digicam" -- start
   pm2 save
   pm2 startup
   ```

> 📖 **Deployment Guide**: See [QUICK_DEPLOY_GUIDE.md](QUICK_DEPLOY_GUIDE.md) for step-by-step instructions.

---

## 📊 Performance

- ⚡ **Lighthouse Score**: 90+ across all metrics
- 🎯 **First Contentful Paint**: < 1.5s
- 📦 **Bundle Size**: 240 kB shared JS
- 🔄 **Optimized Images**: AVIF/WebP support
- 💾 **Smart Caching**: React Query with server-side caching

---

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build and check for errors
npm run build
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Documentation

All detailed documentation has been organized in the `/docs` folder:

### 📂 Main Documentation
- [Environment Configuration Guide](ENVIRONMENT_CONFIG_GUIDE.md)
- [API Security Documentation](API_SECURITY.md)
- [Backend Routes Reference](BACKEND_ROUTES_README.md)
- [Quick Deploy Guide](QUICK_DEPLOY_GUIDE.md)
- [Production Readiness Checklist](PRODUCTION_READINESS.md)

### 📂 Technical Documentation (in `/docs` folder)
- **Camera Conversion** - [CAMERA_CONVERSION_SUMMARY.md](docs/CAMERA_CONVERSION_SUMMARY.md)
- **Performance Optimization** - [PERFORMANCE_OPTIMIZATION_COMPLETE.md](docs/PERFORMANCE_OPTIMIZATION_COMPLETE.md)
- **Performance Quick Reference** - [PERFORMANCE_QUICK_REFERENCE.md](docs/PERFORMANCE_QUICK_REFERENCE.md)
- **Product Schema Documentation** - [PRODUCT_SCHEMA_DOCUMENTATION.md](docs/PRODUCT_SCHEMA_DOCUMENTATION.md)
- **Products Page Fix** - [PRODUCTS_PAGE_FIX.md](docs/PRODUCTS_PAGE_FIX.md)
- **Code Cleanup Summary** - [CODE_CLEANUP_SUMMARY.md](docs/CODE_CLEANUP_SUMMARY.md)
- **Optimization Summary** - [OPTIMIZATION_SUMMARY.md](docs/OPTIMIZATION_SUMMARY.md)

---

## 🐛 Known Issues & Solutions

### Sign In/Sign Up Issues
If authentication isn't working, ensure `NEXTAUTH_URL` matches your current domain:
- Development: `http://localhost:3001`
- Production: `https://yourdomain.com`

See [SIGN_IN_FIX_SUMMARY.md](SIGN_IN_FIX_SUMMARY.md) for details.

### CORS Errors
Make sure your domain is added to allowed origins in:
- `middleware.js` (line 16-26)
- `lib/security.js` (line 11-22)

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Rian Hasan Siam**

- GitHub: [@rianhasansiam](https://github.com/rianhasansiam)


---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Vercel](https://vercel.com/) for hosting and deployment
- [MongoDB](https://www.mongodb.com/) for the database
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities
- All open-source contributors

---

## 📞 Support

For support, email rianhasan1971@gmail.com or create an issue in this repository.

---

<div align="center">

Made with ❤️ by Rian Hasan Siam

⭐ Star this repository if you find it helpful!

</div>
