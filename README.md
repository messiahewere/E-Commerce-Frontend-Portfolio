# E-Commerce Frontend Application

A modern Angular e-commerce application built with Angular 20 and Angular Material, featuring user authentication, product management, shopping cart, and admin functionality.

## Features

- **User Authentication**: Login/Register with JWT token management
- **Product Catalog**: Browse and search products with filtering
- **Shopping Cart**: Add/remove items with quantity management
- **Order Management**: Track and manage customer orders
- **Admin Panel**: Administrative interface for product and order management
- **Responsive Design**: Mobile-friendly UI with Angular Material
- **Route Guards**: Protected routes for authentication and authorization

## Tech Stack

- **Framework**: Angular 20.1.0
- **UI Library**: Angular Material 20.2.14
- **State Management**: RxJS with BehaviorSubject
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router with lazy loading
- **Authentication**: JWT tokens with role-based access

## Project Structure

```
src/app/
├── guards/          # Route guards (auth, admin, dashboard)
├── models/          # TypeScript interfaces and models
├── pages/           # Feature components (home, products, cart, etc.)
├── services/        # Business logic and API services
└── shared/          # Reusable components (header, footer, product-cards)
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI 20.1.1

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Start the development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you make changes.

## Available Routes

- `/home` - Product showcase and homepage
- `/products` - Product catalog with search and filters
- `/carts` - Shopping cart management
- `/orders` - Order history and tracking
- `/login` - User authentication (protected)
- `/dashboard` - User dashboard (protected)
- `/admin` - Admin panel (admin only)

## API Integration

The application connects to a backend API hosted at:
`https://e-commerce-backend-portfolio.onrender.com/api`

### Available Services

- **AuthService**: User authentication and authorization
- **ProductsService**: Product catalog management
- **CartService**: Shopping cart operations
- **SearchService**: Product search functionality

## Building for Production

```bash
ng build
```

Build artifacts will be stored in the `dist/` directory.

## Testing

Run unit tests:

```bash
ng test
```

## Key Features Implementation

### Authentication
- JWT token storage and validation
- Automatic token expiration handling
- Role-based access control (user/admin)

### Guards
- **AuthGuard**: Prevents access to login page when authenticated
- **DashboardGuard**: Protects user dashboard routes
- **AdminGuard**: Restricts admin panel access

### State Management
- Reactive services using RxJS
- BehaviorSubject for token management
- Observable patterns for real-time updates
