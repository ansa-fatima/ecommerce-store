# 🗄️ Database Setup Guide

## Current Status
✅ **Environment file created** (`.env.local`)
✅ **Seed API ready** (`/api/seed`)
✅ **Database models configured**
❌ **MongoDB not installed**

## Quick Setup Options

### Option 1: Install MongoDB Locally (Recommended)

#### For Windows:
1. **Download MongoDB Community Server**
   - Go to: https://www.mongodb.com/try/download/community
   - Select "Windows" and download MSI installer
   - Run the installer with default settings

2. **Start MongoDB Service**
   ```powershell
   # Open PowerShell as Administrator
   net start MongoDB
   ```

3. **Verify Installation**
   ```powershell
   mongod --version
   ```

#### For macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

#### For Linux (Ubuntu/Debian):
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Option 2: Use MongoDB Atlas (Cloud - No Installation)

1. **Create Free Account**
   - Go to: https://cloud.mongodb.com
   - Sign up for free account

2. **Create Cluster**
   - Click "Create Cluster"
   - Choose "Free" tier
   - Select region closest to you

3. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

4. **Update Environment File**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce-store
   ```

## After MongoDB is Running

### 1. Restart Your Application
```powershell
# Stop current server (Ctrl+C)
# Then restart
npm run dev
```

### 2. Seed the Database
Visit: http://localhost:3000/api/seed
- This will create sample data in your database
- You'll see: "Database seeded successfully with test orders!"

### 3. Test the Connection
- Visit: http://localhost:3000/admin
- You should see real data instead of sample data
- Try creating, editing, or deleting products

## What Gets Created

### Collections:
- **products**: 5 sample products (Hijabs, Abayas, Casual wear)
- **categories**: 3 categories (Hijabs, Abayas, Casual)
- **orders**: 3 sample orders with different statuses
- **users**: Admin user account

### Sample Data Includes:
- **Products**: Elegant Hijab Collection, Designer Abaya Set, etc.
- **Categories**: Hijabs, Abayas, Casual wear
- **Orders**: Test orders with different statuses (pending, shipped, delivered)
- **Pricing**: Realistic Pakistani Rupee pricing

## Troubleshooting

### If MongoDB Won't Start:
1. **Check if port 27017 is free**
   ```powershell
   netstat -ano | findstr :27017
   ```

2. **Check MongoDB logs**
   - Windows: `C:\Program Files\MongoDB\Server\6.0\log\mongod.log`
   - macOS: `/usr/local/var/log/mongodb/mongod.log`

3. **Restart MongoDB service**
   ```powershell
   net stop MongoDB
   net start MongoDB
   ```

### If Connection Fails:
1. **Check environment file** (`.env.local`)
2. **Verify MongoDB is running**
3. **Check firewall settings**
4. **Try localhost instead of 127.0.0.1**

## Benefits of Real Database

✅ **Persistent Data**: Changes saved permanently
✅ **Real CRUD Operations**: Create, Read, Update, Delete
✅ **Data Relationships**: Proper product-category relationships
✅ **Scalability**: Can handle thousands of products
✅ **Backup & Recovery**: Data can be backed up
✅ **Production Ready**: Ready for real customers

## Next Steps After Setup

1. **Customize Products**: Add your own product images and descriptions
2. **Configure Categories**: Set up your product categories
3. **Set Up Admin Users**: Create admin accounts
4. **Configure Payment**: Set up payment processing
5. **Deploy**: Deploy to production with real database

Your e-commerce store will be fully functional with a real database! 🎉


