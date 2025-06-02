# 🛒 Retrade Customer Application

The **Retrade Customer Application** is a modern e-commerce platform designed to provide customers with an exceptional online shopping experience. Built with Next.js and featuring a responsive design, this application offers comprehensive shopping functionality from product discovery to order completion.

## 📋 Overview

The Customer Application serves as the primary interface for end-users, providing:

- Intuitive product browsing and search capabilities
- Secure user authentication and account management
- Streamlined shopping cart and checkout process
- Order tracking and purchase history
- User profile and preference management
- Responsive design for all devices

## ✨ Key Features

### 🛍️ Shopping Experience

- **Product Catalog**: Browse extensive product collections
- **Advanced Search**: Find products with intelligent search and filters
- **Product Details**: Comprehensive product information and images
- **Related Products**: Discover similar and recommended items
- **Shopping Cart**: Add, remove, and manage cart items
- **Wishlist**: Save favorite products for later

### 👤 User Account Management

- **User Registration**: Easy account creation process
- **Secure Login**: Authentication with password recovery
- **Profile Management**: Update personal information and preferences
- **Address Management**: Manage shipping and billing addresses
- **Order History**: View past purchases and order status
- **Security Settings**: Account security and privacy controls

### 🔔 Notifications & Communication

- **Order Updates**: Real-time order status notifications
- **Promotional Alerts**: Special offers and discount notifications
- **Account Notifications**: Security and account-related alerts
- **Email Preferences**: Customize communication settings

### ⚙️ Settings & Preferences

- **Account Settings**: Personal information management
- **Billing Information**: Payment method management
- **Notification Preferences**: Control alert settings
- **Privacy Controls**: Data and privacy management
- **Security Options**: Two-factor authentication and password management

## 🛠️ Technology Stack

### Frontend Framework

- **Next.js 15.1.1** - React framework with App Router
- **React 19.0.0** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development

### UI Components & Styling

- **Tailwind CSS 4.1.7** - Utility-first CSS framework
- **DaisyUI 5.0.35** - Beautiful component library
- **Tailwind Animate** - Animation utilities
- **Heroicons** - Beautiful SVG icons
- **React Icons 5.4.0** - Popular icon library
- **Lucide React** - Modern icon set

### State Management & Data

- **Redux Toolkit 2.5.0** - Predictable state container
- **React Redux 9.1.2** - React bindings for Redux
- **Axios 1.7.7** - HTTP client for API requests

### Data & Validation

- **GraphQL 16.10.0** - Query language for APIs
- **Joi 17.13.3** - Data validation library

### Development Tools

- **Turbopack** - Fast bundler for development
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **Yarn** 1.22.22 (recommended)
- **Git** for version control

### Installation

1. **Clone the repository** (if not already done):

   ```bash
   git clone https://github.com/re-trade/rt-client.git
   cd rt-client
   ```

2. **Install dependencies**:

   ```bash
   yarn install
   ```

3. **Set up environment variables**:
   ```bash
   cp apps/customer/.env.example apps/customer/.env.local
   ```
   Configure the following variables:
   ```env
   NEXT_PUBLIC_API_URL=your_api_endpoint
   NEXT_PUBLIC_GRAPHQL_URL=your_graphql_endpoint
   NEXT_PUBLIC_APP_ENV=development
   ```

### Development Commands

```bash
# Start development server with Turbopack
yarn workspace @retrade/rt-client-customer dev

# Build for production
yarn workspace @retrade/rt-client-customer build

# Start production server
yarn workspace @retrade/rt-client-customer start

# Run linting
yarn workspace @retrade/rt-client-customer lint
```

### From Root Directory

```bash
# Start all applications
yarn dev

# Build all applications
yarn build

# Run customer app specifically
yarn workspace @retrade/rt-client-customer dev
```

## 📁 Project Structure

```
apps/customer/
├── app/                          # Next.js App Router
│   ├── cart/                     # Shopping cart
│   ├── forgot-password/          # Password recovery
│   │   └── confirm/              # Password reset confirmation
│   ├── login/                    # User authentication
│   ├── register/                 # User registration
│   ├── product/                  # Product listing
│   ├── productdetail/            # Product details
│   ├── settings/                 # Account settings
│   │   ├── billing/              # Payment settings
│   │   ├── notification/         # Notification preferences
│   │   ├── profile/              # Profile management
│   │   ├── security/             # Security settings
│   │   └── layout.tsx            # Settings layout
│   ├── user/                     # User dashboard
│   │   ├── address/              # Address management
│   │   ├── notification/         # User notifications
│   │   ├── profile/              # User profile
│   │   ├── purchase/             # Purchase history
│   │   ├── security/             # Security settings
│   │   ├── vouchers/             # User vouchers
│   │   └── layout.tsx            # User layout
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
├── components/                   # Shared components
│   ├── Carousel.tsx              # Image carousel
│   ├── chart/                    # Chart components
│   ├── common/                   # Common UI components
│   │   ├── Button.tsx            # Button component
│   │   ├── Dropdown.tsx          # Dropdown component
│   │   ├── Footer.tsx            # Footer component
│   │   ├── Header.tsx            # Header component
│   │   └── UserMenu.tsx          # User menu
│   ├── input/                    # Input components
│   │   ├── InputHandle.ts        # Input utilities
│   │   ├── Search.tsx            # Search component
│   │   └── SearchModal.tsx       # Search modal
│   ├── navbar/                   # Navigation components
│   │   └── LeftNavBar.tsx        # Left navigation
│   └── related-product/          # Related products
├── configs/                      # Configuration files
│   ├── axios.config.ts           # Axios configuration
│   └── env.config.ts             # Environment configuration
├── services/                     # API services
│   ├── auth.api.ts               # Authentication API
│   └── base.api.ts               # Base API configuration
├── lib/                          # Utility functions
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies and scripts
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🌐 API Integration

The Customer Application integrates with multiple backend services:

### Authentication Service

- User registration and login
- Password recovery and reset
- Session management
- OAuth integration

### Product Service

- Product catalog browsing
- Search and filtering
- Product details and images
- Related product recommendations

### Order Service

- Shopping cart management
- Checkout process
- Order tracking
- Purchase history

### User Service

- Profile management
- Address management
- Notification preferences
- Account settings

## 🚀 Deployment

### Production Build

```bash
# Build the application
yarn workspace @retrade/rt-client-customer build

# Start production server
yarn workspace @retrade/rt-client-customer start
```

### Docker Deployment

```bash
# Build Docker image
docker build -f apps/customer/Dockerfile -t retrade-customer .

# Run container
docker run -p 3000:3000 retrade-customer
```

### Environment Variables

```env
# Production environment
NEXT_PUBLIC_API_URL=https://api.retrade.com
NEXT_PUBLIC_GRAPHQL_URL=https://graphql.retrade.com
NEXT_PUBLIC_APP_ENV=production
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=https://retrade.com
```

## 🔧 Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Implement proper error handling
- Write meaningful component and function names

### Component Development

- Use DaisyUI components for consistency
- Implement responsive designs with Tailwind CSS
- Follow the established component structure
- Add proper TypeScript types

### State Management

- Use Redux Toolkit for application state
- Implement proper action creators and reducers
- Handle async operations with RTK Query
- Maintain immutable state updates

### API Integration

- Use Axios for REST API calls
- Implement GraphQL queries where applicable
- Handle loading and error states
- Implement proper data validation with Joi

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop**: Full-featured experience
- **Tablet**: Touch-optimized interface
- **Mobile**: Mobile-first design approach
- **PWA**: Progressive Web App capabilities

## 🔒 Security Features

- Secure authentication flows
- Input validation and sanitization
- HTTPS enforcement
- XSS and CSRF protection
- Secure session management

---

**Version**: 0.1.0  
**Last Updated**: 2024  
**Maintained by**: Retrade Development Team
