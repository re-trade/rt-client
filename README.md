# 🛒 Retrade Client Applications

**Retrade** is a comprehensive e-commerce platform consisting of three specialized applications designed to serve different user roles in the marketplace ecosystem. Built with modern web technologies and a monorepo architecture, this project delivers scalable, performant, and user-friendly experiences across all touchpoints.

## 🏗️ Project Overview

This monorepo contains three main applications:

### 🛠️ [Admin Dashboard](./apps/admin/README.md)

**Administrative Control Center**

- Platform-wide analytics and monitoring
- User and seller account management
- Product catalog oversight and moderation
- Financial reporting and revenue tracking
- System configuration and policy management

### 🛒 [Customer Application](./apps/customer/README.md)

**E-commerce Shopping Platform**

- Product browsing and search functionality
- Shopping cart and checkout process
- User account and profile management
- Order tracking and purchase history
- Responsive design for all devices

### 🏪 [Seller Dashboard](./apps/seller/README.md)

**Business Management Platform**

- Product catalog and inventory management
- Order processing and fulfillment
- Revenue analytics and financial tracking
- Shop branding and configuration
- Marketing tools and promotions

## 🛠️ Technology Stack

### Core Framework

- **Next.js 15+** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development
- **Turbo** - Monorepo build system

### UI & Styling

- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **DaisyUI** - Component library (Customer app)
- **Lucide React** - Modern icon library
- **React Icons** - Comprehensive icon collection

### State Management

- **Redux Toolkit** - Predictable state container
- **React Redux** - React bindings for Redux

### Development Tools

- **Turbopack** - Fast bundler for development
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **Husky** - Git hooks for code quality

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **Yarn** 1.22.22 (recommended)
- **Git** for version control

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/re-trade/rt-client.git
   cd rt-client
   ```

2. **Install dependencies**:

   ```bash
   yarn install
   ```

3. **Set up environment variables** for each app:
   ```bash
   # Copy environment templates
   cp apps/admin/.env.example apps/admin/.env.local
   cp apps/customer/.env.example apps/customer/.env.local
   cp apps/seller/.env.example apps/seller/.env.local
   ```

### Development Commands

```bash
# Start all applications in development mode
yarn dev

# Start specific application
yarn workspace @retrade/rt-client-admin dev      # Admin Dashboard
yarn workspace @retrade/rt-client-customer dev   # Customer App
yarn workspace @retrade/rt-client-seller dev     # Seller Dashboard

# Build all applications
yarn build

# Run linting across all apps
yarn lint

# Format code across all apps
yarn format
```

## 📁 Project Structure

```
rt-client/
├── apps/                         # Applications
│   ├── admin/                    # Admin Dashboard
│   ├── customer/                 # Customer Application
│   └── seller/                   # Seller Dashboard
├── packages/                     # Shared packages
│   ├── components/               # Shared UI components
│   ├── typescript-config/        # TypeScript configurations
│   └── util/                     # Shared utilities
├── .husky/                       # Git hooks
├── package.json                  # Root package configuration
├── turbo.json                    # Turbo configuration
└── yarn.lock                     # Dependency lock file
```

## 🌐 Application URLs

When running in development mode:

- **Admin Dashboard**: http://localhost:3000 (default)
- **Customer Application**: http://localhost:3001
- **Seller Dashboard**: http://localhost:3002

## 🔧 Development Workflow

### Code Quality

This project includes automated code quality tools:

- **Pre-commit Hooks**: Automatically format code before commits
- **Cross-platform Support**: Works on Windows PowerShell, Linux, and macOS
- **ESLint**: Consistent code style and error detection
- **Prettier**: Automatic code formatting
- **TypeScript**: Type safety and better developer experience

### Git Workflow

```bash
# The pre-commit hook will automatically run yarn format
git add .
git commit -m "Your commit message"
# Code is automatically formatted before commit
```

### Monorepo Benefits

- **Shared Dependencies**: Efficient dependency management
- **Code Sharing**: Reusable components and utilities
- **Consistent Tooling**: Unified development experience
- **Atomic Changes**: Cross-application updates in single commits

## 🚀 Deployment

### Production Build

```bash
# Build all applications
yarn build

# Build specific application
yarn workspace @retrade/rt-client-admin build
yarn workspace @retrade/rt-client-customer build
yarn workspace @retrade/rt-client-seller build
```

### Docker Support

Each application includes Docker configuration:

```bash
# Build Docker images
docker build -f apps/admin/Dockerfile -t retrade-admin .
docker build -f apps/customer/Dockerfile -t retrade-customer .
docker build -f apps/seller/Dockerfile -t retrade-seller .
```

### Environment Configuration

Each application requires specific environment variables. See individual README files for detailed configuration:

- [Admin Environment Setup](./apps/admin/README.md#getting-started)
- [Customer Environment Setup](./apps/customer/README.md#getting-started)
- [Seller Environment Setup](./apps/seller/README.md#getting-started)

## 📚 Documentation

### Application-Specific Documentation

- **[Admin Dashboard](./apps/admin/README.md)** - Complete admin features and setup
- **[Customer Application](./apps/customer/README.md)** - Shopping platform details
- **[Seller Dashboard](./apps/seller/README.md)** - Business management tools

### Development Resources

- **Component Library**: Shared UI components in `/packages/components`
- **TypeScript Config**: Shared configurations in `/packages/typescript-config`
- **Utilities**: Common functions in `/packages/util`

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Standards

- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write meaningful commit messages
- Add proper documentation for new features
- Ensure responsive design implementation

## 🔒 Security

- **Authentication**: Secure user authentication across all applications
- **Authorization**: Role-based access control
- **Data Protection**: HTTPS enforcement and data encryption
- **Input Validation**: Comprehensive input sanitization
- **Security Headers**: Proper security header configuration

## 📞 Support

- **Technical Documentation**: Individual app README files
- **Issue Tracking**: GitHub Issues
- **Development Team**: Contact for technical support
- **Business Inquiries**: Contact for partnership opportunities

---

**Version**: 0.1.0
**Last Updated**: 2024
**Maintained by**: Retrade Development Team

## 📄 License

This project is proprietary software. All rights reserved.
