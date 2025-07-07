# 🏪 Retrade Seller Dashboard

The **Retrade Seller Dashboard** is a comprehensive business management platform designed for sellers to efficiently manage their online stores on the Retrade marketplace. This application provides powerful tools for product management, order processing, revenue tracking, and business analytics.

## 📋 Overview

The Seller Dashboard empowers merchants with:

- Complete product catalog management
- Real-time order processing and fulfillment
- Comprehensive revenue and analytics tracking
- Customer communication and support tools
- Business performance insights and reporting
- Multi-channel inventory management

## ✨ Key Features

### 📦 Product Management

- **Product Catalog**: Create, edit, and organize product listings
- **Inventory Control**: Track stock levels and manage variants
- **Bulk Operations**: Mass upload and edit products
- **Product Analytics**: Performance metrics for each product
- **Category Management**: Organize products into categories
- **Image Management**: Upload and manage product images

### 📊 Dashboard & Analytics

- **Business Overview**: Key performance indicators and metrics
- **Sales Analytics**: Revenue trends and sales performance
- **Customer Insights**: Buyer behavior and demographics
- **Product Performance**: Best-selling and underperforming items
- **Financial Reports**: Profit margins and expense tracking
- **Growth Metrics**: Business growth and expansion insights

### 🚚 Order & Shipping Management

- **Order Processing**: Manage incoming orders and fulfillment
- **Shipping Integration**: Connect with shipping providers
- **Tracking Management**: Provide customers with tracking information
- **Return Handling**: Process returns and refunds
- **Shipping Rates**: Configure shipping costs and zones
- **Delivery Analytics**: Monitor shipping performance

### 💰 Revenue Management

- **Sales Tracking**: Monitor daily, weekly, and monthly sales
- **Revenue Analytics**: Detailed financial performance reports
- **Commission Tracking**: Platform fees and commission management
- **Payout Management**: Track earnings and payment schedules
- **Tax Reporting**: Generate tax-related reports
- **Financial Forecasting**: Predict future revenue trends

### 🏪 Shop Management

- **Shop Profile**: Customize shop appearance and branding
- **Business Information**: Manage shop details and policies
- **Shop Analytics**: Monitor shop performance and visitor metrics
- **Brand Management**: Build and maintain brand identity
- **Customer Reviews**: Manage and respond to customer feedback
- **Shop Policies**: Set return, shipping, and privacy policies

### 🎟️ Voucher & Promotions

- **Discount Management**: Create and manage promotional campaigns
- **Voucher Creation**: Generate discount codes and coupons
- **Campaign Analytics**: Track promotion performance
- **Customer Targeting**: Target specific customer segments
- **Seasonal Promotions**: Plan and execute seasonal campaigns
- **A/B Testing**: Test different promotional strategies

### 📍 Address Management

- **Business Addresses**: Manage pickup and return addresses
- **Warehouse Locations**: Configure multiple fulfillment centers
- **Shipping Origins**: Set up shipping origin points
- **Address Validation**: Ensure accurate address information
- **Location Analytics**: Track performance by location

## 🛠️ Technology Stack

### Frontend Framework

- **Next.js 15.1.6** - React framework with App Router
- **React 19.0.0** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development

### UI Components & Styling

- **Radix UI** - Accessible component primitives
  - Avatar, Dialog, Label, Select, Separator, Slot, Switch, Tooltip
- **Tailwind CSS 4.1.7** - Utility-first CSS framework
- **Tailwind Animate** - Animation utilities
- **Class Variance Authority** - Component variant management
- **Lucide React** - Beautiful icon library
- **React Icons 5.5.0** - Comprehensive icon collection

### Development Tools

- **Turbopack** - Fast bundler for development
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing

### Custom Hooks & Utilities

- **use-mobile** - Mobile device detection
- **Custom UI Components** - Tailored business components

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
   cp apps/seller/.env.example apps/seller/.env.local
   ```
   Configure the following variables:
   ```env
   NEXT_PUBLIC_API_URL=your_api_endpoint
   NEXT_PUBLIC_APP_ENV=development
   NEXT_PUBLIC_SELLER_PORTAL_URL=your_seller_portal_url
   ```

### Development Commands

```bash
# Start development server with Turbopack
yarn workspace @retrade/rt-client-seller dev

# Build for production
yarn workspace @retrade/rt-client-seller build

# Start production server
yarn workspace @retrade/rt-client-seller start

# Run linting
yarn workspace @retrade/rt-client-seller lint
```

### From Root Directory

```bash
# Start all applications
yarn dev

# Build all applications
yarn build

# Run seller app specifically
yarn workspace @retrade/rt-client-seller dev
```

## 📁 Project Structure

```
apps/seller/
├── app/                          # Next.js App Router
│   ├── dashboard/                # Main dashboard
│   │   ├── address-management/   # Address management
│   │   ├── product-management/   # Product catalog
│   │   ├── revenue-management/   # Financial tracking
│   │   ├── shipping-management/  # Shipping configuration
│   │   ├── shop-info-management/ # Shop settings
│   │   ├── voucher-management/   # Promotions & discounts
│   │   ├── layout.tsx            # Dashboard layout
│   │   └── RelatedProduct.tsx              # Dashboard home
│   ├── login/                    # Seller authentication
│   ├── register/                 # Seller registration
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
├── components/                   # Shared components
│   ├── step/                     # Multi-step components
│   │   └── account-register/     # Registration steps
│   │       ├── AccountRegisterStep1.tsx
│   │       ├── AccountRegisterStep2.tsx
│   │       ├── AccountRegisterStep3.tsx
│   │       ├── AccountRegisterStep4.tsx
│   │       └── AccountRegisterStep5.tsx
│   └── ui/                       # UI components
│       ├── avatar.tsx            # Avatar component
│       ├── badge.tsx             # Badge component
│       ├── button.tsx            # Button component
│       ├── card.tsx              # Card component
│       ├── dialog.tsx            # Dialog component
│       ├── input.tsx             # Input component
│       ├── label.tsx             # Label component
│       ├── select.tsx            # Select component
│       ├── separator.tsx         # Separator component
│       ├── sheet.tsx             # Sheet component
│       ├── sidebar.tsx           # Sidebar component
│       ├── skeleton.tsx          # Skeleton loader
│       ├── switch.tsx            # Switch component
│       ├── table.tsx             # Table component
│       ├── textarea.tsx          # Textarea component
│       ├── tooltip.tsx           # Tooltip component
│       └── dialog/               # Dialog variants
│           ├── add/              # Create dialogs
│           │   ├── create-address-dialog.tsx
│           │   ├── create-product-dialog.tsx
│           │   ├── create-shipping-dialog.tsx
│           │   └── create-voucher-dialog.tsx
│           └── view-update/      # Edit dialogs
│               ├── edit-address-dialog.tsx
│               ├── edit-product-dialog.tsx
│               ├── edit-shipping-dialog.tsx
│               ├── edit-voucher-dialog.tsx
│               ├── revenue-detail-dialog.tsx
│               └── shop-info-edit.tsx
├── hooks/                        # Custom React hooks
│   └── use-mobile.tsx            # Mobile detection hook
├── lib/                          # Utility functions
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🌐 API Integration

The Seller Dashboard integrates with the Retrade backend for:

### Business Management

- Seller registration and onboarding
- Shop profile and branding management
- Business verification and compliance

### Product Operations

- Product CRUD operations
- Inventory management
- Category and attribute management
- Image upload and processing

### Order Processing

- Order retrieval and management
- Shipping integration
- Return and refund processing
- Customer communication

### Financial Operations

- Revenue tracking and analytics
- Commission calculations
- Payout management
- Tax reporting

### Marketing Tools

- Voucher and promotion management
- Campaign analytics
- Customer targeting
- Performance tracking

## 🚀 Deployment

### Production Build

```bash
# Build the application
yarn workspace @retrade/rt-client-seller build

# Start production server
yarn workspace @retrade/rt-client-seller start
```

### Docker Deployment

```bash
# Build Docker image
docker build -f apps/seller/Dockerfile -t retrade-seller .

# Run container
docker run -p 3000:3000 retrade-seller
```

### Environment Variables

```env
# Production environment
NEXT_PUBLIC_API_URL=https://api.retrade.com
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_SELLER_PORTAL_URL=https://seller.retrade.com
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=https://seller.retrade.com
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

### Business Logic

- Implement proper data validation
- Handle edge cases for business operations
- Maintain data consistency across operations
- Implement proper error boundaries

### Performance Optimization

- Optimize component rendering
- Implement proper loading states
- Use React.memo for expensive components
- Optimize API calls and data fetching

## 📊 Business Features

### Multi-step Registration

The seller onboarding process includes:

1. **Basic Information** - Business details and contact info
2. **Business Verification** - Legal documents and verification
3. **Shop Setup** - Branding and shop configuration
4. **Payment Setup** - Banking and payment information
5. **Final Review** - Confirmation and activation

### Dashboard Analytics

- **Revenue Metrics** - Daily, weekly, monthly performance
- **Product Performance** - Best sellers and inventory insights
- **Customer Analytics** - Buyer behavior and demographics
- **Growth Tracking** - Business expansion metrics

### Advanced Management Tools

- **Bulk Operations** - Mass product updates and management
- **Automated Rules** - Business rule automation
- **Integration APIs** - Third-party service connections
- **Advanced Reporting** - Custom business reports

## 📱 Mobile Responsiveness

The Seller Dashboard is fully responsive with:

- **Mobile-first Design** - Optimized for mobile devices
- **Touch-friendly Interface** - Easy navigation on tablets
- **Responsive Tables** - Adaptive data presentation
- **Mobile Gestures** - Swipe and touch interactions

## 🔒 Security & Compliance

### Data Protection

- Secure data transmission (HTTPS)
- Input validation and sanitization
- XSS and CSRF protection
- Secure session management

### Business Compliance

- Tax calculation and reporting
- Legal document management
- Privacy policy compliance
- GDPR and data protection

### Financial Security

- Secure payment processing
- PCI DSS compliance
- Fraud detection and prevention
- Audit trail maintenance

## 🚀 Performance Features

- **Server-side Rendering** - Fast initial page loads
- **Static Generation** - Optimized static pages
- **Image Optimization** - Automatic image processing
- **Code Splitting** - Efficient bundle loading
- **Caching Strategies** - Optimized data caching

## 📞 Support & Resources

- **Seller Help Center** - Comprehensive documentation
- **API Documentation** - Technical integration guides
- **Business Resources** - Selling best practices
- **Technical Support** - Developer assistance

---

**Version**: 0.1.0
**Last Updated**: 2024
**Maintained by**: Retrade Development Team
