# 🛠️ Retrade Admin Dashboard

Welcome to the **Retrade Admin Dashboard** - a comprehensive platform administration interface built with Next.js 15 and modern web technologies. This application provides powerful tools for managing the entire Retrade e-commerce ecosystem with real-time analytics, user management, and system monitoring capabilities.

## 📋 Table of Contents

- [🛠️ Retrade Admin Dashboard](#️-retrade-admin-dashboard)
  - [📋 Table of Contents](#-table-of-contents)
  - [🎯 Overview](#-overview)
  - [✨ Key Features](#-key-features)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [🏗️ Project Structure](#️-project-structure)
  - [⚡ Quick Start](#-quick-start)
  - [🔧 Configuration](#-configuration)
  - [📊 Dashboard Features](#-dashboard-features)
  - [🔒 Security & Access Control](#-security--access-control)
  - [🚀 Deployment](#-deployment)
  - [📚 Development Guidelines](#-development-guidelines)

## 🎯 Overview

The Admin Dashboard serves as the central command center for the Retrade platform, providing administrators with comprehensive tools to monitor, manage, and optimize the entire e-commerce ecosystem. Built with performance and usability in mind, it offers real-time insights and powerful management capabilities.

**Application Details:**

- **Package Name**: `@retrade/rt-client-admin`
- **Port**: 3000 (development)
- **Framework**: Next.js 15 with App Router
- **Build Tool**: Turbopack for fast development

## ✨ Key Features

### 👥 User & Account Management

- **User Administration**: Comprehensive user account management and monitoring
- **Seller Management**: Seller verification, approval, and performance tracking
- **Role-Based Access Control**: Granular permission management
- **Account Analytics**: User behavior and engagement metrics

### 📊 Analytics & Reporting

- **Platform Analytics**: Real-time platform performance metrics
- **Revenue Tracking**: Financial overview and revenue analytics
- **Sales Reports**: Detailed sales performance analysis
- **Custom Dashboards**: Interactive charts and data visualizations

### 🏢 Platform Management

- **Brand Administration**: Brand registration and management
- **Category Management**: Product category organization
- **Platform Fee Configuration**: Fee structure management
- **Voucher System**: Platform-wide voucher and promotion management

### 🚨 Monitoring & Alerts

- **System Alerts**: Real-time system monitoring and notifications
- **Report Management**: User and seller report handling
- **Financial Oversight**: Transaction monitoring and fraud detection
- **Withdrawal Processing**: Seller withdrawal request management

### 📈 Business Intelligence

- **Performance Metrics**: KPI tracking and business intelligence
- **Growth Analytics**: Platform growth and trend analysis
- **Customer Insights**: Customer behavior and satisfaction metrics
- **Seller Performance**: Seller success metrics and rankings

## 🛠️ Tech Stack

### Core Framework

- **Next.js 15**: React framework with App Router and Turbopack
- **TypeScript 5**: Strict type checking and enhanced developer experience
- **React 19**: Latest React features with concurrent rendering

### UI & Styling

- **Tailwind CSS 4.1**: Utility-first CSS framework
- **DaisyUI 5.0**: Component library built on Tailwind CSS
- **Radix UI**: Accessible, unstyled UI primitives
- **Lucide React**: Beautiful, customizable icons

### Data Visualization

- **Recharts 3.1**: Composable charting library for React
- **Custom Charts**: Interactive dashboards and analytics
- **Real-time Updates**: Live data visualization

### State Management

- **Redux Toolkit 2.5**: Predictable state container
- **React Redux 9.2**: Official React bindings for Redux
- **Context API**: Local state management for UI components

### Development Tools

- **ESLint 9**: Code linting and quality enforcement
- **Prettier 3**: Code formatting and style consistency
- **Husky**: Git hooks for quality assurance
- **TypeScript Config**: Shared TypeScript configurations

### Specialized Libraries

- **XLSX**: Excel file processing and export functionality
- **Joi**: Schema validation for forms and API data
- **Axios**: HTTP client with interceptors
- **FingerprintJS**: Device fingerprinting for security

## 🏗️ Project Structure

```
apps/admin/
├── app/                      # Next.js App Router
│   ├── dashboard/           # Main dashboard routes
│   │   ├── alerts/         # System alerts management
│   │   ├── brand/          # Brand administration
│   │   ├── category/       # Category management
│   │   ├── customer/       # Customer management
│   │   ├── financial/      # Financial oversight
│   │   ├── order/          # Order management
│   │   ├── platform-fee/   # Platform fee configuration
│   │   ├── product/        # Product administration
│   │   ├── report-seller/  # Seller reports
│   │   ├── reports/        # General reports
│   │   ├── revenue/        # Revenue analytics
│   │   ├── seller/         # Seller management
│   │   ├── settings/       # System settings
│   │   ├── user/           # User administration
│   │   ├── voucher-management/ # Voucher system
│   │   └── withdraw/       # Withdrawal processing
│   ├── login/              # Authentication
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── auth/              # Authentication components
│   ├── common/            # Shared components
│   ├── dashboard/         # Dashboard-specific components
│   ├── dialog/            # Modal dialogs
│   ├── layout/            # Layout components
│   ├── navbar/            # Navigation components
│   ├── product/           # Product-related components
│   ├── table/             # Data table components
│   ├── ui/                # UI primitives
│   └── withdraw/          # Withdrawal components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── services/              # API service layer
└── public/                # Static assets
```

## ⚡ Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Yarn >= 1.22.22
- Access to Retrade backend APIs

### Installation & Development

```bash
# Navigate to admin directory
cd apps/admin

# Install dependencies (from root)
yarn install

# Start development server with Turbopack
yarn dev

# Or run from root
yarn workspace @retrade/rt-client-admin dev
```

### Build for Production

```bash
# Build the application
yarn build

# Start production server
yarn start
```

**Access the application:**

- Development: http://localhost:3000
- Production: https://admin.retrade.local

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the `apps/admin` directory:

```env
# API Configuration
API_BASE_URL=https://api.retrade.local
SOCKET_URL=wss://socket.retrade.local

# Application Environment
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_NAME=Retrade Admin Dashboard

# Security
NEXT_PUBLIC_FINGERPRINT_API_KEY=your_fingerprint_api_key

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### Next.js Configuration

The application uses a custom Next.js configuration (`next.config.ts`):

```typescript
const nextConfig: NextConfig = {
  output: 'standalone',           // Docker-optimized builds
  typescript: {
    ignoreBuildErrors: true,      // Flexible TypeScript handling
  },
  eslint: {
    ignoreDuringBuilds: true,     # Separate linting process
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',              # Allow all HTTPS images
      },
    ],
  },
};
```

## 📊 Dashboard Features

### Main Dashboard

- **Overview Metrics**: Key performance indicators and platform health
- **Real-time Charts**: Live data visualization with automatic updates
- **Quick Actions**: Fast access to common administrative tasks
- **Alert Summary**: System alerts and notifications overview

### User Management

- **User Directory**: Comprehensive user search and filtering
- **Account Details**: Detailed user profiles and activity history
- **Bulk Operations**: Mass user management capabilities
- **Security Monitoring**: Suspicious activity detection and reporting

### Financial Management

- **Revenue Analytics**: Platform revenue tracking and forecasting
- **Transaction Monitoring**: Real-time transaction oversight
- **Platform Fees**: Fee structure configuration and management
- **Withdrawal Processing**: Seller payout request handling

### Content Management

- **Product Oversight**: Platform-wide product management
- **Brand Administration**: Brand verification and management
- **Category Structure**: Product category organization
- **Content Moderation**: User-generated content review

## 🔒 Security & Access Control

### Authentication

- **JWT-based Authentication**: Secure token-based authentication
- **Multi-factor Authentication**: Enhanced security for admin accounts
- **Session Management**: Secure session handling and timeout
- **Device Fingerprinting**: Additional security layer

### Authorization

- **Role-based Access Control**: Granular permission system
- **Feature Flags**: Conditional feature access
- **Audit Logging**: Comprehensive action logging
- **IP Whitelisting**: Network-level access control

### Data Protection

- **Encrypted Communication**: All API communications encrypted
- **Sensitive Data Masking**: PII protection in UI
- **Secure Headers**: Comprehensive security headers
- **CSRF Protection**: Cross-site request forgery prevention

## 🚀 Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -t retrade-admin .

# Run container
docker run -p 3000:3000 retrade-admin

# Using Docker Compose
docker compose -f .docker/compose.yaml --profile admin up -d
```

### Production Considerations

- **Environment Variables**: Secure environment configuration
- **SSL/TLS**: HTTPS enforcement in production
- **CDN Integration**: Static asset optimization
- **Monitoring**: Application performance monitoring
- **Backup Strategy**: Data backup and recovery procedures

## 📚 Development Guidelines

### Code Standards

- **TypeScript Strict Mode**: Enforce type safety
- **ESLint Configuration**: Consistent code quality
- **Component Architecture**: Reusable, composable components
- **Error Boundaries**: Robust error handling
- **Performance Optimization**: Lazy loading and code splitting

### Component Development

- **Radix UI Primitives**: Accessible component foundation
- **Tailwind CSS**: Utility-first styling approach
- **Responsive Design**: Mobile-first responsive layouts
- **Dark Mode Support**: Theme switching capabilities
- **Internationalization**: Multi-language support ready

### API Integration

- **Service Layer**: Centralized API communication
- **Error Handling**: Comprehensive error management
- **Loading States**: User-friendly loading indicators
- **Caching Strategy**: Efficient data caching
- **Real-time Updates**: WebSocket integration for live data

### Testing Strategy

- **Unit Testing**: Component and utility testing
- **Integration Testing**: API integration testing
- **E2E Testing**: Critical user journey testing
- **Performance Testing**: Load and stress testing
- **Security Testing**: Vulnerability assessment

---

For more information about the overall Retrade platform, see the [main README](../../README.md).
