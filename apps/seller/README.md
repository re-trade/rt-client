# 🏪 Retrade Seller Dashboard

Welcome to the **Retrade Seller Dashboard** - a comprehensive seller management platform built with Next.js 15 and modern web technologies. This application empowers sellers with powerful tools to manage their business, track performance, and grow their sales on the Retrade marketplace.

## 📋 Table of Contents

- [🏪 Retrade Seller Dashboard](#-retrade-seller-dashboard)
  - [📋 Table of Contents](#-table-of-contents)
  - [🎯 Overview](#-overview)
  - [✨ Key Features](#-key-features)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [🏗️ Project Structure](#️-project-structure)
  - [⚡ Quick Start](#-quick-start)
  - [🔧 Configuration](#-configuration)
  - [📊 Dashboard Features](#-dashboard-features)
  - [💬 Communication Tools](#-communication-tools)
  - [🚀 Deployment](#-deployment)
  - [📚 Development Guidelines](#-development-guidelines)

## 🎯 Overview

The Seller Dashboard is designed to provide sellers with everything they need to succeed on the Retrade platform. From product management to customer communication, analytics to order fulfillment, this comprehensive tool helps sellers optimize their business operations and maximize their revenue.

**Application Details:**

- **Package Name**: `@retrade/rt-client-seller`
- **Port**: 3002 (development)
- **Framework**: Next.js 15 with App Router
- **Build Tool**: Turbopack for fast development

## ✨ Key Features

### 📦 Product Management

- **Product Catalog**: Complete product lifecycle management
- **Inventory Tracking**: Real-time stock monitoring and alerts
- **Product Analytics**: Performance metrics and insights
- **Bulk Operations**: Efficient mass product management
- **Image Management**: Multi-image upload and optimization

### 📋 Order Management

- **Order Processing**: Streamlined order fulfillment workflow
- **Order Tracking**: Real-time order status updates
- **Shipping Integration**: Logistics and shipping management
- **Return Handling**: Customer return and refund processing
- **Order Analytics**: Sales performance analysis

### 💰 Financial Management

- **Revenue Tracking**: Comprehensive financial analytics
- **Sales Reports**: Detailed sales performance metrics
- **Withdrawal Management**: Easy payout request system
- **Transaction History**: Complete financial transaction records
- **Profit Analysis**: Margin and profitability insights

### 📊 Analytics & Reporting

- **Performance Dashboard**: Key business metrics and KPIs
- **Sales Analytics**: Revenue trends and forecasting
- **Customer Insights**: Buyer behavior and preferences
- **Product Performance**: Best-selling products and trends
- **Interactive Charts**: Visual data representation

### 💬 Customer Communication

- **Real-time Chat**: Direct customer communication
- **Video Calls**: WebRTC-powered video communication
- **Message Management**: Organized conversation history
- **Customer Support**: Integrated support ticket system
- **Notification System**: Real-time alerts and updates

### 🎫 Marketing Tools

- **Voucher Management**: Create and manage promotional codes
- **Campaign Analytics**: Marketing campaign performance
- **Customer Segmentation**: Targeted marketing capabilities
- **Promotion Scheduling**: Automated promotional campaigns

## 🛠️ Tech Stack

### Core Framework

- **Next.js 15**: React framework with App Router and Turbopack
- **TypeScript 5**: Strict type checking and enhanced developer experience
- **React 19**: Latest React features with concurrent rendering

### UI & Styling

- **Tailwind CSS 4.1**: Utility-first CSS framework
- **Radix UI**: Accessible, unstyled UI primitives
- **Framer Motion 12**: Smooth animations and transitions
- **Lucide React**: Beautiful, customizable icons
- **Tabler Icons**: Additional icon library

### Data Visualization

- **Recharts 2.15**: Composable charting library for React
- **Custom Charts**: Interactive business analytics
- **Real-time Updates**: Live data visualization

### Real-time Communication

- **STOMP.js 7.1**: WebSocket messaging protocol
- **WebRTC**: Peer-to-peer video communication
- **Socket.io Client**: Real-time bidirectional communication
- **Custom WebRTC Config**: Optimized video call setup

### State Management

- **React Context API**: Application state management
- **Custom Hooks**: Reusable state logic
- **Local Storage**: Persistent client-side storage

### Development Tools

- **ESLint 9**: Code linting and quality enforcement
- **Prettier**: Code formatting and style consistency
- **Husky**: Git hooks for quality assurance
- **TypeScript Config**: Shared TypeScript configurations

### Specialized Libraries

- **React Icons**: Comprehensive icon library
- **Sonner**: Beautiful toast notifications
- **React Markdown**: Markdown rendering support
- **FingerprintJS**: Device fingerprinting for security

## 🏗️ Project Structure

```
apps/seller/
├── app/                      # Next.js App Router
│   ├── dashboard/           # Main dashboard routes
│   │   ├── address/        # Address management
│   │   ├── chat/           # Customer communication
│   │   ├── my-order/       # Personal orders
│   │   ├── my-product/     # Product management
│   │   ├── notifications/  # Notification center
│   │   ├── orders/         # Order management
│   │   ├── product/        # Product catalog
│   │   ├── report/         # Reporting system
│   │   ├── revenue/        # Financial analytics
│   │   ├── review/         # Customer reviews
│   │   ├── seller-info/    # Seller profile
│   │   ├── shipping/       # Shipping management
│   │   └── voucher/        # Voucher management
│   ├── login/              # Authentication
│   ├── register/           # Seller registration
│   ├── pending/            # Account pending approval
│   └── ban/                # Account suspended
├── components/             # React components
│   ├── chat/              # Communication components
│   ├── common/            # Shared components
│   ├── dashboard/         # Dashboard-specific components
│   ├── dialog-common/     # Modal dialogs
│   ├── notification/      # Notification components
│   ├── order/             # Order-related components
│   ├── product/           # Product components
│   ├── registration/      # Registration flow
│   ├── report/            # Reporting components
│   ├── shared/            # Shared utilities
│   └── ui/                # UI primitives
├── context/               # React Context providers
├── hooks/                 # Custom React hooks
├── service/               # API service layer
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── public/                # Static assets
```

## ⚡ Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Yarn >= 1.22.22
- Access to Retrade backend APIs

### Installation & Development

```bash
# Navigate to seller directory
cd apps/seller

# Install dependencies (from root)
yarn install

# Start development server with Turbopack
yarn dev

# Or run from root
yarn workspace @retrade/rt-client-seller dev
```

### Build for Production

```bash
# Build the application
yarn build

# Start production server
yarn start
```

**Access the application:**

- Development: http://localhost:3002
- Production: https://seller.retrade.local

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the `apps/seller` directory:

```env
# API Configuration
API_BASE_URL=https://api.retrade.local
SOCKET_URL=wss://socket.retrade.local

# Application Environment
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_NAME=Retrade Seller Dashboard

# WebRTC Configuration
NEXT_PUBLIC_WEBRTC_STUN_SERVER=stun:stun.l.google.com:19302
NEXT_PUBLIC_WEBRTC_TURN_SERVER=turn:your-turn-server.com

# Security
NEXT_PUBLIC_FINGERPRINT_API_KEY=your_fingerprint_api_key

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## 📊 Dashboard Features

### Main Dashboard

- **Business Overview**: Key performance metrics and insights
- **Recent Activity**: Latest orders, messages, and notifications
- **Quick Actions**: Fast access to common seller tasks
- **Performance Charts**: Visual representation of business data

### Product Management

- **Product Catalog**: Comprehensive product listing and management
- **Inventory Control**: Stock level monitoring and alerts
- **Product Analytics**: Performance metrics for each product
- **Bulk Operations**: Efficient mass product updates

### Order Fulfillment

- **Order Queue**: Organized order processing workflow
- **Shipping Management**: Integrated logistics and tracking
- **Customer Communication**: Direct order-related messaging
- **Return Processing**: Streamlined return and refund handling

### Financial Analytics

- **Revenue Dashboard**: Comprehensive financial overview
- **Sales Trends**: Historical and predictive analytics
- **Profit Margins**: Detailed profitability analysis
- **Withdrawal System**: Easy payout request management

## 💬 Communication Tools

### Real-time Chat

- **Customer Messaging**: Direct communication with buyers
- **Message History**: Organized conversation management
- **File Sharing**: Image and document sharing capabilities
- **Typing Indicators**: Real-time conversation feedback

### Video Communication

- **WebRTC Integration**: High-quality video calls
- **Screen Sharing**: Product demonstration capabilities
- **Call Recording**: Optional call recording for quality assurance
- **Mobile Support**: Cross-platform video communication

### Notification System

- **Real-time Alerts**: Instant notifications for important events
- **Notification Center**: Centralized notification management
- **Custom Preferences**: Personalized notification settings
- **Push Notifications**: Browser and mobile push notifications

## 🚀 Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -t retrade-seller .

# Run container
docker run -p 3002:3000 retrade-seller

# Using Docker Compose
docker compose -f .docker/compose.yaml --profile seller up -d
```

### Production Considerations

- **Environment Configuration**: Secure environment setup
- **SSL/TLS**: HTTPS enforcement for security
- **CDN Integration**: Optimized asset delivery
- **Performance Monitoring**: Application health tracking
- **Backup Strategy**: Data protection and recovery

## 📚 Development Guidelines

### Code Standards

- **TypeScript Strict Mode**: Comprehensive type safety
- **Component Architecture**: Modular, reusable components
- **Error Handling**: Robust error boundaries and fallbacks
- **Performance Optimization**: Code splitting and lazy loading
- **Accessibility**: WCAG-compliant user interface

### Component Development

- **Radix UI Foundation**: Accessible component primitives
- **Responsive Design**: Mobile-first development approach
- **Animation Integration**: Smooth Framer Motion animations
- **Theme Support**: Consistent design system implementation
- **Internationalization**: Multi-language support ready

### API Integration

- **Service Layer**: Centralized API communication
- **Real-time Updates**: WebSocket and STOMP integration
- **Error Management**: Comprehensive error handling
- **Caching Strategy**: Optimized data fetching
- **Loading States**: User-friendly loading indicators

### Testing Strategy

- **Component Testing**: Unit tests for React components
- **Integration Testing**: API and service integration tests
- **E2E Testing**: Critical user journey automation
- **Performance Testing**: Load and stress testing
- **Accessibility Testing**: WCAG compliance verification

---

For more information about the overall Retrade platform, see the [main README](../../README.md).
