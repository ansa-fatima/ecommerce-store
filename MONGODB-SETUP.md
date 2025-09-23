# MongoDB Integration Setup Guide

## Prerequisites
- MongoDB installed and running on your system
- Node.js and npm installed

## Setup Steps

### 1. Install Dependencies
```bash
npm install mongodb
```

### 2. Create Environment File
Create a `.env.local` file in your project root with the following content:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce-store

# Next.js Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Admin Configuration
ADMIN_EMAIL=admin@azhcollection.com
ADMIN_PASSWORD=admin123
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### 4. Seed the Database
After starting your Next.js application, visit:
```
http://localhost:3000/api/seed
```
This will create sample data in your MongoDB database.

### 5. Test the Integration
- Visit the admin panel: `http://localhost:3000/admin`
- Login with: `admin@azhcollection.com` / `admin123`
- Try adding, editing, or deleting products
- Check the MongoDB database to see the data

## Database Structure

### Collections Created:
- **products**: Store product information
- **orders**: Store order details
- **users**: Store user accounts
- **categories**: Store product categories

### Key Features:
- ✅ Full CRUD operations for products
- ✅ Order management system
- ✅ User authentication
- ✅ Category management
- ✅ Search and filtering
- ✅ Admin panel integration

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT /api/products` - Update product
- `DELETE /api/products?id={id}` - Delete product
- `GET /api/products/[id]` - Get product by ID

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/[id]` - Update order

### Database Seeding
- `POST /api/seed` - Initialize database with sample data

## Troubleshooting

### Common Issues:
1. **Connection Error**: Make sure MongoDB is running
2. **Environment Variables**: Check your `.env.local` file
3. **Database Not Found**: Run the seed endpoint first
4. **Permission Issues**: Check MongoDB user permissions

### MongoDB Atlas (Cloud)
If using MongoDB Atlas, update your `MONGODB_URI` to:
```
mongodb+srv://username:password@cluster.mongodb.net/ecommerce-store
```

## Next Steps
1. Customize the product models as needed
2. Add more API endpoints for specific features
3. Implement user authentication with MongoDB
4. Add data validation and error handling
5. Set up database backups

Your ecommerce store is now fully integrated with MongoDB! 🎉





