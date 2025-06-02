# 🛠️ Retrade Admin Dashboard

The **Retrade Admin Dashboard** is a comprehensive administrative interface for managing the Retrade e-commerce platform. This application provides administrators with powerful tools to oversee users, products, orders, financial reports, and overall platform operations.

## 📋 Overview

The Admin Dashboard serves as the central control hub for the Retrade platform, enabling administrators to:

- Monitor platform-wide analytics and metrics
- Manage user accounts and permissions
- Oversee product catalog and inventory
- Handle order processing and fulfillment
- Generate financial and business reports
- Configure platform settings and policies

## ✨ Key Features

### 📊 Dashboard & Analytics

- **Real-time Metrics**: Live platform statistics and KPIs
- **Revenue Tracking**: Financial performance monitoring
- **User Analytics**: Customer and seller behavior insights
- **Order Management**: Comprehensive order tracking and processing

### 👥 User Management

- **User Administration**: Manage customer and seller accounts
- **Role-based Access**: Configure user permissions and roles
- **Account Verification**: Handle user verification processes
- **Support Tools**: Customer service and dispute resolution

### 📦 Product Management

- **Catalog Oversight**: Monitor and moderate product listings
- **Inventory Control**: Track stock levels across the platform
- **Category Management**: Organize product categories and attributes
- **Quality Assurance**: Review and approve product submissions

### 💰 Financial Management

- **Revenue Reports**: Detailed financial analytics and reporting
- **Transaction Monitoring**: Track payments and refunds
- **Commission Management**: Handle seller commission structures
- **Financial Alerts**: Automated notifications for important events

### ⚙️ Platform Settings

- **System Configuration**: Platform-wide settings and preferences
- **Policy Management**: Terms of service and platform policies
- **Alert System**: Configure notifications and alerts
- **Shop Management**: Oversee seller shop configurations

## 🛠️ Technology Stack

### Frontend Framework

- **Next.js 15.3.2** - React framework with App Router
- **React 19.0.0** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development

### UI Components & Styling

- **Radix UI** - Accessible component primitives
  - Dropdown Menu, Select, Slot, Switch, Tabs
- **Tailwind CSS 4.1.7** - Utility-first CSS framework
- **Tailwind Animate** - Animation utilities
- **Lucide React** - Beautiful icon library
- **Class Variance Authority** - Component variant management

### State Management & Data

- **Redux Toolkit 2.5.1** - Predictable state container
- **React Redux 9.2.0** - React bindings for Redux
- **Axios 1.7.9** - HTTP client for API requests

### Charts & Visualization

- **Recharts 2.15.3** - Composable charting library

### Development Tools

- **Turbopack** - Fast bundler for development
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing

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
   cp apps/admin/.env.example apps/admin/.env.local
   ```
   Configure the following variables:
   ```env
   NEXT_PUBLIC_API_URL=your_api_endpoint
   NEXT_PUBLIC_APP_ENV=development
   ```

### Development Commands

```bash
# Start development server with Turbopack
yarn workspace @retrade/rt-client-admin dev

# Build for production
yarn workspace @retrade/rt-client-admin build

# Start production server
yarn workspace @retrade/rt-client-admin start

# Run linting
yarn workspace @retrade/rt-client-admin lint
```

### From Root Directory

```bash
# Start all applications
yarn dev

# Build all applications
yarn build

# Run admin specifically
yarn workspace @retrade/rt-client-admin dev
```

## 📁 Project Structure

```
apps/admin/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin routes
│   │   ├── layout.tsx           # Admin layout
│   │   ├── page.tsx             # Admin dashboard
│   │   ├── products/            # Product management
│   │   └── users/               # User management
│   ├── dashboard/               # Main dashboard
│   │   ├── alerts/              # Alert management
│   │   ├── financial-reports/   # Financial reporting
│   │   ├── order-management/    # Order processing
│   │   ├── product-management/  # Product oversight
│   │   ├── reports/             # Analytics reports
│   │   ├── revenue-management/  # Revenue tracking
│   │   ├── settings/            # Platform settings
│   │   ├── shop-management/     # Shop administration
│   │   ├── user-management/     # User administration
│   │   ├── layout.tsx           # Dashboard layout
│   │   └── page.tsx             # Dashboard home
│   ├── components/              # Shared components
│   │   ├── AdminNavbar.tsx      # Navigation component
│   │   ├── ProductTable.tsx     # Product data table
│   │   ├── UserTable.tsx        # User data table
│   │   └── ui/                  # UI components
│   ├── lib/                     # Utility functions
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout
├── components.json              # Shadcn/ui configuration
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── tailwind.config.ts           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

## 🌐 API Integration

The Admin Dashboard integrates with the Retrade backend API for:

### Authentication & Authorization

- Admin login and session management
- Role-based access control
- Permission validation

### Data Management

- User CRUD operations
- Product catalog management
- Order processing workflows
- Financial data retrieval

### Real-time Updates

- Live dashboard metrics
- Notification systems
- Alert management

## 🚀 Deployment

### Production Build

```bash
# Build the application
yarn workspace @retrade/rt-client-admin build

# Start production server
yarn workspace @retrade/rt-client-admin start
```

### Docker Deployment

```bash
# Build Docker image
docker build -f apps/admin/Dockerfile -t retrade-admin .

# Run container
docker run -p 3000:3000 retrade-admin
```

### Environment Variables

```env
# Production environment
NEXT_PUBLIC_API_URL=https://api.retrade.com
NEXT_PUBLIC_APP_ENV=production
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=https://admin.retrade.com
```

## 🔧 Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Implement proper error handling
- Write meaningful component and function names

### Component Development

- Use Radix UI primitives for accessibility
- Implement responsive designs with Tailwind CSS
- Follow the established component structure
- Add proper TypeScript types

### State Management

- Use Redux Toolkit for complex state
- Implement proper action creators and reducers
- Handle async operations with RTK Query
- Maintain immutable state updates

## 📞 Support & Documentation

- **Technical Documentation**: [Internal Wiki]
- **API Documentation**: [API Docs]
- **Design System**: [Component Library]
- **Support**: Contact the development team

## 🔒 Security Considerations

- Implement proper authentication flows
- Validate all user inputs
- Use HTTPS in production
- Follow OWASP security guidelines
- Regular security audits and updates

---

**Version**: 0.1.0
**Last Updated**: 2024
**Maintained by**: Retrade Development Team
