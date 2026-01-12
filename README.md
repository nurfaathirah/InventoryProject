# PC & Laptop Inventory Management System

A modern web application for managing PC and Laptop inventory with stock tracking, deployment management, and reporting features.

## Features

- 📊 **Dashboard** - Overview with statistics and location-based stock counts
- 📦 **Stock In** - Add new items and manage incoming stock
- 📤 **Stock Out** - Track stock deployment with staff assignments
- 📋 **Stock Out List** - View all deployed stock entries
- 📈 **Reports** - Generate and export inventory reports
- 🔍 **Search** - Search across inventory and navigate to items
- 👤 **User Authentication** - Login and Sign Up functionality

## Tech Stack

### Frontend
- React 18
- Vite
- Modern CSS with Blue & White theme

### Backend
- Node.js
- Express.js
- MySQL (via XAMPP)

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- XAMPP (for MySQL database)
- npm or yarn

### 1. Database Setup (XAMPP)

1. **Start XAMPP Services**
   - Open XAMPP Control Panel
   - Start **Apache** and **MySQL**

2. **Create Database**
   - Open phpMyAdmin: `http://localhost/phpmyadmin`
   - Go to SQL tab
   - Run the SQL file: `server/database/schema.sql`
   - Database `inventory_management` will be created with sample data

   See `DATABASE_SETUP.md` for detailed instructions.

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start server (development mode)
npm run dev

# Or production mode
npm start
```

Backend will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## Project Structure

```
InventoryProject/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── services/       # API services
│   └── package.json
├── server/                 # Node.js backend
│   ├── database/
│   │   ├── schema.sql     # MySQL database schema
│   │   └── connection.js  # Database connection
│   ├── server.js           # Express server
│   └── package.json
└── README.md
```

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

- **users** - User accounts (id, name, email, password)
- **items** - PC/Laptop items (id, name, category, brand, model)
- **stock** - Stock entries (id, item_id, serial_number, asset_id, location, etc.)
- **stock_out** - Deployed stock entries

## Switching from localStorage to MySQL

The frontend currently uses localStorage. To switch to MySQL:

1. Ensure backend server is running
2. Update `client/src/services/storage.js` to use `api.js` functions
3. Or create a wrapper that checks for API availability

## Development

### Frontend Development
```bash
cd client
npm run dev
```

### Backend Development
```bash
cd server
npm run dev  # Uses nodemon for auto-reload
```

## Building for Production

### Frontend
```bash
cd client
npm run build
```

### Backend
```bash
cd server
npm start
```

## Troubleshooting

### Database Connection Issues
- Ensure XAMPP MySQL is running
- Check database credentials in `server/database/connection.js`
- Verify database exists: `inventory_management`

### Port Conflicts
- Frontend default: 3000
- Backend default: 3001
- Update ports in `vite.config.js` and `server.js` if needed

### CORS Errors
- Ensure backend server is running
- Check API_BASE_URL in `client/src/services/api.js`

## License

ISC
