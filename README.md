# Ecommerce Store

A modern, full-stack ecommerce web application built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🛍️ Customer Features
- **Product Browsing**: Browse products with advanced filtering and search
- **Product Details**: Detailed product pages with images, reviews, and specifications
- **Shopping Cart**: Add/remove items, update quantities, and manage cart
- **User Authentication**: Secure login and registration
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, attractive interface with smooth animations

### 🔧 Admin Features
- **Dashboard**: Overview of store statistics and recent activity
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and manage customer orders
- **Customer Management**: Manage customer accounts
- **Inventory Tracking**: Monitor stock levels and product availability

### 🚀 Technical Features
- **Next.js 14**: Latest React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **MongoDB**: NoSQL database for flexible data storage
- **Zustand**: Lightweight state management
- **Form Validation**: Client and server-side validation with Zod
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ecommerce-store
   JWT_SECRET=your-super-secret-jwt-key-here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── cart/          # Cart management
│   │   ├── orders/        # Order processing
│   │   └── products/      # Product CRUD operations
│   ├── admin/             # Admin panel
│   ├── cart/              # Shopping cart page
│   ├── login/             # Login page
│   ├── products/          # Product pages
│   └── register/          # Registration page
├── components/             # Reusable UI components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Site footer
│   ├── ProductCard.tsx    # Product display card
│   └── Button.tsx         # Custom button component
├── lib/                   # Utility libraries
│   ├── models/            # Database models
│   └── db.ts              # Database connection
├── store/                 # State management
│   ├── authStore.ts       # Authentication state
│   └── cartStore.ts       # Shopping cart state
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── hooks/                 # Custom React hooks
```

## API Endpoints

### Products
- `GET /api/products` - Get all products with filtering and pagination
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create new product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)
- `POST /api/products/[id]/reviews` - Add product review

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get single order
- `PUT /api/orders/[id]` - Update order status (admin)

## Database Schema

### Products
```typescript
{
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  brand: string
  inStock: boolean
  stock: number
  rating: number
  reviews: Review[]
  tags: string[]
}
```

### Users
```typescript
{
  name: string
  email: string
  password: string
  role: 'user' | 'admin'
  addresses: Address[]
}
```

### Orders
```typescript
{
  userId: string
  items: OrderItem[]
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  totalAmount: number
}
```

## Technologies Used

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **Database**: MongoDB with Mongoose
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Heroicons
- **Authentication**: JWT with bcryptjs
- **Deployment**: Vercel (recommended)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please open an issue or contact the development team.

---

Built with ❤️ using Next.js and TypeScript
