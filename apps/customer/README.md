# 🛒 Retrade Customer Application

Welcome to the **Retrade Customer Application** - a modern, feature-rich e-commerce platform built with Next.js 15 and cutting-edge web technologies. This application provides customers with an intuitive, fast, and secure shopping experience with real-time features and comprehensive account management.

## 📋 Table of Contents

- [🛒 Retrade Customer Application](#-retrade-customer-application)
  - [📋 Table of Contents](#-table-of-contents)
  - [🎯 Overview](#-overview)
  - [✨ Key Features](#-key-features)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [🏗️ Project Structure](#️-project-structure)
  - [⚡ Quick Start](#-quick-start)
  - [🔧 Configuration](#-configuration)
  - [🛍️ Shopping Experience](#️-shopping-experience)
  - [👤 User Account Features](#-user-account-features)
  - [💬 Communication Features](#-communication-features)
  - [🚀 Deployment](#-deployment)
  - [📚 Development Guidelines](#-development-guidelines)

## 🎯 Overview

The Retrade Customer Application is the main storefront of the Retrade e-commerce platform, designed to provide customers with a seamless, engaging, and secure shopping experience. Built with performance and user experience as top priorities, it offers modern e-commerce features with real-time capabilities.

**Application Details:**

- **Package Name**: `@retrade/rt-client-customer`
- **Port**: 3001 (development)
- **Framework**: Next.js 15 with App Router
- **Build Tool**: Turbopack for fast development

## ✨ Key Features

### 🛍️ E-commerce Core

- **Product Catalog**: Advanced product browsing with filtering and search
- **Shopping Cart**: Real-time cart updates with persistent storage
- **Secure Checkout**: Multi-step checkout with payment integration
- **Order Tracking**: Real-time order status and delivery tracking
- **Wishlist**: Save products for later purchase
- **Product Comparison**: Side-by-side product comparison

### 👤 User Account Management

- **User Profiles**: Comprehensive profile management
- **Address Book**: Multiple shipping and billing addresses
- **Order History**: Complete purchase history with reorder functionality
- **Digital Wallet**: Integrated wallet for payments and refunds
- **Security Settings**: Two-factor authentication and security controls
- **Notification Preferences**: Customizable notification settings

### 💳 Payment & Financial

- **Multiple Payment Methods**: Credit cards, digital wallets, bank transfers
- **Secure Transactions**: PCI-compliant payment processing
- **Wallet Integration**: Built-in digital wallet system
- **Transaction History**: Complete financial transaction records
- **Refund Management**: Automated refund processing

### 📱 Mobile-First Design

- **Responsive Layout**: Optimized for all device sizes
- **Touch-Friendly Interface**: Mobile-optimized interactions
- **Progressive Web App**: PWA capabilities for app-like experience
- **Offline Support**: Basic offline functionality
- **Fast Loading**: Optimized performance for mobile networks

### 💬 Communication & Support

- **Real-time Chat**: Direct communication with sellers
- **Video Calls**: WebRTC-powered video communication
- **Customer Support**: Integrated help and support system
- **Product Reviews**: Rate and review purchased products
- **Q&A System**: Product questions and answers

### 🔔 Real-time Features

- **Live Notifications**: Real-time order and system updates
- **Stock Alerts**: Inventory level notifications
- **Price Alerts**: Price change notifications
- **Chat Notifications**: Instant message alerts
- **Order Updates**: Real-time order status changes

## 🛠️ Tech Stack

### Core Framework

- **Next.js 15**: React framework with App Router and Turbopack
- **TypeScript 5**: Strict type checking and enhanced developer experience
- **React 19**: Latest React features with concurrent rendering

### UI & Styling

- **Tailwind CSS 4.1**: Utility-first CSS framework
- **DaisyUI 5.0**: Component library built on Tailwind CSS
- **Framer Motion 12**: Smooth animations and micro-interactions
- **Heroicons**: Beautiful, hand-crafted SVG icons
- **Lucide React**: Additional icon library

### Real-time Communication

- **STOMP.js 7.1**: WebSocket messaging protocol
- **Socket.io Client**: Real-time bidirectional communication
- **WebRTC**: Peer-to-peer video communication
- **Push Notifications**: Browser notification API

### State Management

- **React Context API**: Application state management
- **Custom Hooks**: Reusable state logic and side effects
- **Local Storage**: Persistent client-side data
- **Session Storage**: Temporary session data

### Data & API

- **Axios 1.9**: HTTP client with interceptors
- **Custom API Layer**: Centralized API communication
- **Real-time Updates**: WebSocket integration
- **Caching Strategy**: Optimized data fetching

### Development Tools

- **ESLint 8**: Code linting and quality enforcement
- **Prettier**: Code formatting and style consistency
- **TypeScript Config**: Shared TypeScript configurations
- **Autoprefixer**: CSS vendor prefixing

### Specialized Libraries

- **date-fns 4.1**: Modern date utility library
- **ColorThief 2.6**: Dynamic color extraction from images
- **UUID 11.1**: Unique identifier generation
- **Joi 17.13**: Schema validation for forms
- **FingerprintJS 4.6**: Device fingerprinting for security

## 🏗️ Project Structure

```
apps/customer/
├── app/                      # Next.js App Router
│   ├── cart/                # Shopping cart
│   ├── category/            # Product categories
│   ├── chat/                # Customer communication
│   ├── checkout/            # Checkout process
│   ├── forgot-password/     # Password recovery
│   ├── login/               # User authentication
│   ├── policy/              # Terms and policies
│   ├── product/             # Product pages
│   ├── register/            # User registration
│   ├── seller/              # Seller profiles
│   └── user/                # User account management
│       ├── address/         # Address management
│       ├── notification/    # Notification center
│       ├── payment-methods/ # Payment methods
│       ├── profile/         # User profile
│       ├── purchase/        # Order history
│       ├── reports/         # User reports
│       ├── review/          # Product reviews
│       ├── security/        # Security settings
│       └── wallet/          # Digital wallet
├── components/              # React components
│   ├── address/            # Address components
│   ├── auth/               # Authentication components
│   ├── bank/               # Banking components
│   ├── cart/               # Shopping cart components
│   ├── category/           # Category components
│   ├── chat/               # Chat components
│   ├── common/             # Shared components
│   ├── gallery/            # Image gallery
│   ├── header/             # Header components
│   ├── input/              # Input components
│   ├── navbar/             # Navigation components
│   ├── notification/       # Notification components
│   ├── order/              # Order components
│   ├── payment/            # Payment components
│   ├── product/            # Product components
│   ├── purchase/           # Purchase components
│   ├── related-product/    # Related products
│   ├── report/             # Reporting components
│   ├── reusable/           # Reusable UI components
│   ├── review/             # Review components
│   ├── seller/             # Seller components
│   ├── share/              # Social sharing
│   ├── toast/              # Toast notifications
│   ├── ui/                 # UI primitives
│   └── wallet/             # Wallet components
├── context/                # React Context providers
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── services/               # API service layer
├── utils/                  # Helper utilities
└── public/                 # Static assets
```

## ⚡ Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Yarn >= 1.22.22
- Access to Retrade backend APIs

### Installation & Development

```bash
# Navigate to customer directory
cd apps/customer

# Install dependencies (from root)
yarn install

# Start development server with Turbopack
yarn dev

# Or run from root
yarn workspace @retrade/rt-client-customer dev
```

### Build for Production

```bash
# Build the application
yarn build

# Start production server
yarn start
```

**Access the application:**

- Development: http://localhost:3001
- Production: https://retrade.local

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the `apps/customer` directory:

```env
# API Configuration
API_BASE_URL=https://api.retrade.local
SOCKET_URL=wss://socket.retrade.local

# Application Environment
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_NAME=Retrade

# Payment Configuration
NEXT_PUBLIC_PAYMENT_GATEWAY_URL=https://payment.retrade.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# WebRTC Configuration
NEXT_PUBLIC_WEBRTC_STUN_SERVER=stun:stun.l.google.com:19302

# Security
NEXT_PUBLIC_FINGERPRINT_API_KEY=your_fingerprint_api_key

# Social Features
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### Next.js Configuration

The application uses a custom Next.js configuration (`next.config.mjs`):

```javascript
const nextConfig = {
  output: 'standalone', // Docker-optimized builds
  typescript: {
    ignoreBuildErrors: true, // Flexible TypeScript handling
  },
  eslint: {
    ignoreDuringBuilds: true, // Separate linting process
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*', // Allow all HTTPS images
      },
    ],
  },
};
```

## 🛍️ Shopping Experience

### Product Discovery

- **Advanced Search**: Full-text search with filters and sorting
- **Category Navigation**: Hierarchical category browsing
- **Product Recommendations**: AI-powered product suggestions
- **Recently Viewed**: Track and display recently viewed products
- **Trending Products**: Popular and trending item highlights

### Shopping Cart

- **Real-time Updates**: Instant cart synchronization
- **Persistent Cart**: Cart data preserved across sessions
- **Quantity Management**: Easy quantity adjustments
- **Price Calculations**: Real-time pricing with taxes and discounts
- **Shipping Estimates**: Dynamic shipping cost calculation

### Checkout Process

- **Multi-step Checkout**: Streamlined checkout flow
- **Guest Checkout**: Purchase without account creation
- **Address Selection**: Multiple shipping addresses
- **Payment Options**: Various payment method support
- **Order Confirmation**: Detailed order summary and confirmation

### Order Management

- **Order Tracking**: Real-time order status updates
- **Delivery Tracking**: Integration with shipping providers
- **Order History**: Complete purchase history
- **Reorder Functionality**: Quick reorder from history
- **Return Requests**: Easy return and refund process

## 👤 User Account Features

### Profile Management

- **Personal Information**: Comprehensive profile editing
- **Avatar Upload**: Profile picture management
- **Preferences**: Shopping and notification preferences
- **Account Verification**: Email and phone verification
- **Privacy Settings**: Data privacy and sharing controls

### Address Management

- **Multiple Addresses**: Unlimited shipping and billing addresses
- **Address Validation**: Real-time address verification
- **Default Settings**: Set default shipping and billing addresses
- **Address Labels**: Custom address naming and organization
- **Quick Selection**: Fast address selection during checkout

### Security Features

- **Two-Factor Authentication**: Enhanced account security
- **Password Management**: Secure password updates
- **Login History**: Track account access history
- **Device Management**: Manage trusted devices
- **Security Alerts**: Suspicious activity notifications

### Digital Wallet

- **Wallet Balance**: View and manage wallet funds
- **Transaction History**: Complete transaction records
- **Top-up Options**: Multiple funding methods
- **Withdrawal Requests**: Easy fund withdrawal
- **Payment Integration**: Use wallet for purchases

## 💬 Communication Features

### Real-time Chat

- **Seller Communication**: Direct messaging with sellers
- **Chat History**: Persistent conversation records
- **File Sharing**: Image and document sharing
- **Typing Indicators**: Real-time conversation feedback
- **Message Status**: Read receipts and delivery status

### Video Communication

- **WebRTC Integration**: High-quality video calls
- **Screen Sharing**: Product demonstration viewing
- **Call History**: Record of video communications
- **Mobile Support**: Cross-platform video support
- **Connection Quality**: Adaptive video quality

### Notifications

- **Real-time Alerts**: Instant notifications for important events
- **Push Notifications**: Browser and mobile notifications
- **Email Notifications**: Configurable email alerts
- **SMS Notifications**: Optional SMS alerts for critical updates
- **Notification Center**: Centralized notification management

## 🚀 Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -t retrade-customer .

# Run container
docker run -p 3001:3000 retrade-customer

# Using Docker Compose
docker compose -f .docker/compose.yaml --profile customer up -d
```

### Production Considerations

- **CDN Integration**: Global content delivery optimization
- **SSL/TLS**: HTTPS enforcement for security
- **Performance Monitoring**: Real user monitoring (RUM)
- **Error Tracking**: Comprehensive error logging
- **SEO Optimization**: Search engine optimization
- **Analytics Integration**: User behavior tracking

## 📚 Development Guidelines

### Code Standards

- **TypeScript Strict Mode**: Comprehensive type safety
- **Component Architecture**: Modular, reusable components
- **Error Boundaries**: Robust error handling and fallbacks
- **Performance Optimization**: Code splitting and lazy loading
- **Accessibility**: WCAG 2.1 AA compliance

### Component Development

- **Mobile-First Design**: Responsive design principles
- **Touch-Friendly Interface**: Optimized for touch interactions
- **Animation Guidelines**: Smooth, purposeful animations
- **Loading States**: User-friendly loading indicators
- **Error States**: Graceful error handling and recovery

### API Integration

- **Service Layer**: Centralized API communication
- **Real-time Updates**: WebSocket and STOMP integration
- **Offline Support**: Basic offline functionality
- **Caching Strategy**: Intelligent data caching
- **Error Handling**: Comprehensive error management

### Performance Optimization

- **Image Optimization**: Next.js Image component usage
- **Code Splitting**: Route and component-level splitting
- **Bundle Analysis**: Regular bundle size monitoring
- **Core Web Vitals**: Performance metrics optimization
- **Progressive Enhancement**: Graceful degradation support

### Testing Strategy

- **Component Testing**: React component unit tests
- **Integration Testing**: API and service integration tests
- **E2E Testing**: Critical user journey automation
- **Performance Testing**: Load and stress testing
- **Accessibility Testing**: WCAG compliance verification
- **Cross-browser Testing**: Multi-browser compatibility

---

For more information about the overall Retrade platform, see the [main README](../../README.md).
