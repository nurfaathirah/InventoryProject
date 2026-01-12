# Inventory Management System - Backend Server

## Setup Instructions for XAMPP

### 1. Start XAMPP Services
- Open XAMPP Control Panel
- Start **Apache** and **MySQL** services

### 2. Create Database
- Open phpMyAdmin (http://localhost/phpmyadmin)
- Or use MySQL command line
- Run the SQL file: `database/schema.sql`
- This will create the database and tables automatically

### 3. Install Dependencies
```bash
cd server
npm install
```

### 4. Configure Database (if needed)
- Edit `database/connection.js` if your MySQL password is not empty
- Default XAMPP MySQL user: `root`, password: `` (empty)

### 5. Run Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### 6. Test Connection
- Open browser: http://localhost:3001/api/health
- Should see: `{"success":true,"message":"Server is running"}`

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/current` - Get current user

### Items
- `GET /api/items` - Get all items
- `POST /api/items` - Add new item
- `DELETE /api/items/:id` - Delete item

### Stock
- `GET /api/stock` - Get all stock entries
- `POST /api/stock` - Add stock entries
- `PUT /api/stock/:id` - Update stock entry
- `DELETE /api/stock/:id` - Delete stock entry
- `GET /api/inventory` - Get inventory (items with stock)

### Stock Out
- `GET /api/stock-out` - Get all stock out entries
- `POST /api/stock-out` - Move stock to stock out

### Stats
- `GET /api/stats` - Get statistics

## Database Schema

- **users** - User accounts
- **items** - PC/Laptop items
- **stock** - Stock entries
- **stock_out** - Deployed stock entries
