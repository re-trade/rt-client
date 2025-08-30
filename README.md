# 🛒 Retrade Client Applications

Welcome to the **Retrade** client applications repository! This monorepo contains all frontend applications for the Retrade e-commerce platform, built with modern web technologies and designed for scalability and performance.

## 📋 Table of Contents

- [🛒 Retrade Client Applications](#-retrade-client-applications)
  - [📋 Table of Contents](#-table-of-contents)
  - [🏗️ Architecture Overview](#️-architecture-overview)
  - [🚀 Applications](#-applications)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [📦 Project Structure](#-project-structure)
  - [⚡ Quick Start](#-quick-start)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Development](#development)
    - [Production Build](#production-build)
  - [🐳 Docker Deployment](#-docker-deployment)
    - [Local Development](#local-development)
    - [Production Deployment](#production-deployment)
  - [🔧 Configuration](#-configuration)
  - [📚 Development Guidelines](#-development-guidelines)
  - [🧪 Testing & Quality](#-testing--quality)
  - [📈 Performance](#-performance)
  - [🔒 Security](#-security)
  - [🚀 CI/CD Pipeline](#-cicd-pipeline)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)

## 🏗️ Architecture Overview

Retrade is a comprehensive e-commerce platform built with a microservices architecture. This repository contains three specialized frontend applications that interact with backend services through RESTful APIs, real-time WebSocket connections, and STOMP messaging.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Customer App  │    │   Seller App    │    │   Admin App     │
│   (Next.js 15)  │    │   (Next.js 15)  │    │   (Next.js 15)  │
│   Port: 3001    │    │   Port: 3002    │    │   Port: 3000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  Backend APIs   │
                    │  (Microservices)│
                    │  + WebSocket    │
                    │  + STOMP        │
                    └─────────────────┘
```

## 🚀 Applications

### 🛍️ Customer Application (`@retrade/rt-client-customer`)

- **Port**: 3001 (development)
- **Purpose**: Main e-commerce storefront for customers
- **Key Features**:
  - 🛒 Product browsing and search
  - 🛍️ Shopping cart with real-time updates
  - 💳 Secure checkout and payment processing
  - 👤 User account management and profiles
  - 📦 Order tracking and history
  - 💬 Real-time chat with sellers
  - 📱 Responsive mobile-first design
  - 🔔 Real-time notifications
  - 💰 Digital wallet integration
  - ⭐ Product reviews and ratings
  - 📍 Address management
  - 🎯 Personalized recommendations

### 🏪 Seller Dashboard (`@retrade/rt-client-seller`)

- **Port**: 3002 (development)
- **Purpose**: Comprehensive seller management portal
- **Key Features**:
  - 📊 Advanced analytics and reporting
  - 📦 Product catalog management
  - 📋 Order processing and fulfillment
  - 💰 Revenue tracking and financial reports
  - 📈 Sales performance metrics
  - 💬 Customer communication tools
  - 🚚 Shipping and logistics management
  - 🎫 Voucher and promotion management
  - 📱 Mobile-responsive interface
  - 🔔 Real-time order notifications
  - 👥 Customer relationship management
  - 📊 Interactive charts and dashboards

### 🛠️ Admin Dashboard (`@retrade/rt-client-admin`)

- **Port**: 3000 (development)
- **Purpose**: Platform administration and management
- **Key Features**:
  - 👥 User and seller management
  - 🏢 Brand and category administration
  - 📊 Platform-wide analytics
  - 💰 Financial oversight and platform fees
  - 🚨 Alert and monitoring systems
  - 📋 Report management
  - ⚙️ System configuration
  - 🔒 Security and access control
  - 📈 Revenue and growth tracking
  - 🎫 Voucher system management
  - 💸 Withdrawal request processing

## 🛠️ Tech Stack

### Core Technologies

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router & Turbopack
- **Language**: [TypeScript 5.5+](https://www.typescriptlang.org/) (Strict mode)
- **Styling**: [Tailwind CSS 4.1+](https://tailwindcss.com/) with DaisyUI
- **Build Tool**: [Turbo 2.5+](https://turbo.build/) (Monorepo management)
- **Package Manager**: [Yarn 1.22+](https://yarnpkg.com/) with Workspaces
- **Runtime**: Node.js 18+

### UI Components & Design System

- **Component Library**: [Radix UI](https://www.radix-ui.com/) (Accessible primitives)
- **Icons**: [Lucide React](https://lucide.dev/), [Heroicons](https://heroicons.com/), [Tabler Icons](https://tabler.io/icons)
- **Charts**: [Recharts 3.1+](https://recharts.org/) (Admin), [Recharts 2.15+](https://recharts.org/) (Seller)
- **Animations**: [Framer Motion 12+](https://www.framer.com/motion/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Styling Utils**: [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge)

### State Management & Data Fetching

- **HTTP Client**: [Axios 1.7+](https://axios-http.com/) with custom interceptors
- **State Management**:
  - React Context API (Customer, Seller)
  - Redux Toolkit 2.5+ (Admin)
- **Real-time Communication**:
  - [STOMP.js 7.1+](https://stomp-js.github.io/) over WebSocket
  - Socket.io Client 4.8+ (Utility package)
- **Form Handling**: Custom hooks with [Joi](https://joi.dev/) validation

### Development & Build Tools

- **Linting**: [ESLint 9+](https://eslint.org/) with Next.js config
- **Formatting**: [Prettier 3.5+](https://prettier.io/) with plugins
- **Git Hooks**: [Husky 9.1+](https://typicode.github.io/husky/)
- **Type Checking**: TypeScript strict mode with custom configs
- **Device Fingerprinting**: [FingerprintJS 4.6+](https://fingerprintjs.com/)

### Specialized Libraries

- **File Processing**: [XLSX](https://sheetjs.com/) (Admin)
- **Markdown**: [React Markdown](https://github.com/remarkjs/react-markdown) with GFM
- **Date Handling**: [date-fns 4.1+](https://date-fns.org/) (Customer)
- **Color Processing**: [ColorThief 2.6+](https://lokeshdhakar.com/projects/color-thief/) (Customer)
- **WebRTC**: Custom WebRTC configuration for video calls

## 📦 Project Structure

```
retrade-client/
├── apps/
│   ├── customer/              # Customer-facing e-commerce app
│   │   ├── app/              # Next.js App Router pages
│   │   ├── components/       # React components
│   │   ├── context/          # React Context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API service layer
│   │   └── utils/            # Utility functions
│   ├── seller/               # Seller dashboard application
│   │   ├── app/              # Next.js App Router pages
│   │   ├── components/       # React components
│   │   ├── context/          # React Context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── service/          # API service layer
│   │   └── utils/            # Utility functions
│   └── admin/                # Admin dashboard application
│       ├── app/              # Next.js App Router pages
│       ├── components/       # React components
│       ├── hooks/            # Custom React hooks
│       ├── services/         # API service layer
│       └── lib/              # Utility functions
├── packages/
│   ├── components/           # Shared UI components
│   ├── util/                 # Shared utilities and APIs
│   │   ├── src/api/          # HTTP client configuration
│   │   ├── src/socket/       # WebSocket/STOMP configuration
│   │   ├── src/webrtc/       # WebRTC configuration
│   │   └── src/file/         # File handling utilities
│   └── typescript-config/    # Shared TypeScript configurations
├── .docker/                  # Docker configurations
│   ├── compose.yaml          # Production deployment
│   ├── compose.local.yaml    # Local development
│   └── compose.build.yaml    # Build configuration
├── .github/                  # GitHub Actions workflows
│   └── workflows/
│       ├── main.yaml         # Main deployment pipeline
│       ├── deploy-dev.yaml   # Development deployment
│       └── build-image.yaml  # Docker image building
└── .husky/                   # Git hooks configuration
```

## ⚡ Quick Start

### Prerequisites

- **Node.js**: >= 18.0.0
- **Yarn**: >= 1.22.22
- **Docker**: >= 20.0.0 (for containerized deployment)
- **Git**: Latest version

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd retrade-client

# Install dependencies for all workspaces
yarn install

# Build shared packages
yarn build
```

### Development

```bash
# Start all applications in development mode with Turbopack
yarn dev

# Start specific application
yarn workspace @retrade/rt-client-customer dev
yarn workspace @retrade/rt-client-seller dev
yarn workspace @retrade/rt-client-admin dev

# Run with specific port (if needed)
yarn workspace @retrade/rt-client-customer dev -- --port 3001
```

**Application URLs:**

- **Customer App**: http://localhost:3001
- **Seller Dashboard**: http://localhost:3002
- **Admin Dashboard**: http://localhost:3000

### Production Build

```bash
# Build all applications
yarn build

# Build specific application
yarn workspace @retrade/rt-client-customer build

# Start production server
yarn workspace @retrade/rt-client-customer start
```

## 🐳 Docker Deployment

### Local Development

```bash
# Start all services locally with development profile
docker compose -f .docker/compose.local.yaml --profile dev up -d

# Start specific service
docker compose -f .docker/compose.local.yaml --profile customer up -d
docker compose -f .docker/compose.local.yaml --profile seller up -d
docker compose -f .docker/compose.local.yaml --profile admin up -d

# View logs
docker compose -f .docker/compose.local.yaml logs -f
```

### Production Deployment

```bash
# Deploy to staging environment
docker compose -f .docker/compose.yaml --profile stag up -d

# Deploy to production environment
docker compose -f .docker/compose.yaml --profile prod up -d

# Deploy specific service to production
docker compose -f .docker/compose.yaml --profile customer up -d
```

**Production URLs:**

- **Customer**: `https://retrade.local` (prod) / `https://dev.retrade.local` (staging)
- **Seller**: `https://seller.retrade.local` (prod) / `https://seller-dev.retrade.local` (staging)
- **Admin**: `https://admin.retrade.local` (prod) / `https://admin-dev.retrade.local` (staging)

## 🔧 Configuration

Each application uses environment variables for configuration. Create `.env.local` files in each app directory:

### Customer App (`.env.local`)

```env
API_BASE_URL=https://api.retrade.local
SOCKET_URL=wss://socket.retrade.local
NEXT_PUBLIC_APP_ENV=development
```

### Seller App (`.env.local`)

```env
API_BASE_URL=https://api.retrade.local
SOCKET_URL=wss://socket.retrade.local
NEXT_PUBLIC_APP_ENV=development
```

### Admin App (`.env.local`)

```env
API_BASE_URL=https://api.retrade.local
SOCKET_URL=wss://socket.retrade.local
NEXT_PUBLIC_APP_ENV=development
```

## 📚 Development Guidelines

### Code Style & Standards

- Follow TypeScript strict mode with proper type definitions
- Use functional components with React hooks
- Implement proper error boundaries for robust error handling
- Follow the established folder structure and naming conventions
- Use ESLint and Prettier for consistent code formatting

### Component Development

- Use Radix UI primitives for accessible, unstyled components
- Implement responsive design with Tailwind CSS mobile-first approach
- Create reusable components in the shared packages when applicable
- Follow the compound component pattern for complex UI elements
- Use proper TypeScript interfaces for component props

### API Integration

- Use the shared API utilities from `@retrade/util` package
- Implement comprehensive error handling with user-friendly messages
- Use TypeScript interfaces for all API request/response types
- Handle loading, success, and error states consistently across components
- Implement proper caching strategies for frequently accessed data

### State Management

- Use React Context for application-wide state in Customer and Seller apps
- Use Redux Toolkit for complex state management in Admin app
- Implement proper state normalization for complex data structures
- Use custom hooks to encapsulate state logic and side effects

## 🧪 Testing & Quality

```bash
# Run linting across all workspaces
yarn lint

# Format code with Prettier
yarn format

# Type checking
yarn type-check

# Run specific linting
yarn workspace @retrade/rt-client-customer lint
```

### Quality Assurance

- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: Automated code formatting with custom configuration
- **Husky**: Pre-commit hooks for code quality enforcement
- **TypeScript**: Strict mode enabled for type safety

## 📈 Performance

### Optimization Strategies

- **Bundle Optimization**: Next.js automatic code splitting and tree shaking
- **Image Optimization**: Next.js Image component with remote pattern support
- **Lazy Loading**: Component-level code splitting with dynamic imports
- **Caching**: Proper HTTP caching headers and Next.js built-in caching
- **Turbopack**: Fast bundler for development with hot module replacement

### Performance Monitoring

- Built-in Next.js analytics and performance metrics
- Custom performance tracking for critical user journeys
- Bundle analyzer integration for bundle size monitoring

## 🔒 Security

### Security Measures

- **Authentication**: JWT-based authentication with refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **HTTPS**: Enforced in production with proper SSL/TLS configuration
- **Input Validation**: Client and server-side validation with Joi schemas
- **XSS Protection**: Sanitized user inputs and CSP headers
- **Device Fingerprinting**: FingerprintJS for enhanced security
- **Secure Headers**: Comprehensive security headers configuration

### Data Protection

- Sensitive data encryption in transit and at rest
- Proper session management and token handling
- GDPR-compliant data handling practices

## 🚀 CI/CD Pipeline

### GitHub Actions Workflows

#### Main Pipeline (`main.yaml`)

- Triggers on push to `main` branch
- Builds Docker images for all applications
- Deploys to both staging and production environments

#### Build Process (`build-image.yaml`)

- Matrix strategy for parallel builds (customer, seller, admin)
- Separate builds for development and production environments
- Pushes images to GitHub Container Registry (GHCR)

#### Deployment (`deploy-dev.yaml`)

- Automated deployment to development and production servers
- Docker Compose orchestration with proper profiles
- Automatic cleanup of old images and containers

### Deployment Environments

- **Development**: Continuous deployment from `main` branch
- **Staging**: Pre-production testing environment
- **Production**: Stable production environment with manual approval

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the coding standards
4. Run tests and linting (`yarn lint && yarn type-check`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request with detailed description

### Pull Request Guidelines

- Provide clear description of changes
- Include screenshots for UI changes
- Ensure all checks pass (linting, type checking)
- Update documentation if necessary
- Request review from relevant team members

## 📄 License

This project is proprietary and confidential. All rights reserved by Retrade Platform.
