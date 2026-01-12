# Database Setup Guide for XAMPP

## Step 1: Start XAMPP Services

1. Open **XAMPP Control Panel**
2. Click **Start** for **Apache** service
3. Click **Start** for **MySQL** service
4. Both should show green/running status

## Step 2: Create Database

### Option A: Using phpMyAdmin (Recommended)

1. Open your browser
2. Go to: `http://localhost/phpmyadmin`
3. Click on **SQL** tab at the top
4. Copy and paste the contents of `server/database/schema.sql`
5. Click **Go** button
6. Database and tables will be created automatically

### Option B: Using MySQL Command Line

1. Open Command Prompt/Terminal
2. Navigate to XAMPP MySQL bin directory:
   ```bash
   cd C:\xampp\mysql\bin
   ```
3. Login to MySQL:
   ```bash
   mysql -u root -p
   ```
   (Press Enter when asked for password - default is empty)
4. Run the SQL file:
   ```sql
   source C:/path/to/InventoryProject/server/database/schema.sql
   ```
   Or copy-paste the SQL commands directly

## Step 3: Verify Database Creation

1. In phpMyAdmin, you should see:
   - Database: `inventory_management`
   - Tables: `users`, `items`, `stock`, `stock_out`

2. Check if sample data was inserted:
   - Go to `items` table - should have 3 sample items
   - Go to `stock` table - should have 4 sample stock entries

## Step 4: Configure Backend Server

1. Navigate to server directory:
   ```bash
   cd InventoryProject/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Check database connection settings in `server/database/connection.js`:
   ```javascript
   host: 'localhost',
   user: 'root',
   password: '', // Empty for default XAMPP
   database: 'inventory_management'
   ```

4. If you changed MySQL root password, update the password in `connection.js`

## Step 5: Start Backend Server

```bash
cd server
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

Server should start on `http://localhost:3001`

## Step 6: Test Connection

1. Open browser: `http://localhost:3001/api/health`
2. Should see: `{"success":true,"message":"Server is running"}`

## Step 7: Update Frontend to Use API

The frontend is currently using localStorage. To switch to MySQL:

1. Update `client/src/services/storage.js` to use `api.js` instead
2. Or create a new service file that uses the API

## Troubleshooting

### MySQL Connection Error
- Make sure MySQL service is running in XAMPP
- Check if port 3306 is available
- Verify database name is `inventory_management`

### Port Already in Use
- Change PORT in `server/server.js` if 3001 is taken
- Update API_BASE_URL in `client/src/services/api.js` accordingly

### Database Not Found
- Make sure you ran the schema.sql file
- Check database name matches in connection.js

### CORS Errors
- Make sure backend server is running
- Check API_BASE_URL in frontend matches backend URL

## Database Structure

```
inventory_management
├── users (id, name, email, password, created_at, updated_at)
├── items (id, name, category, brand, model, created_at, updated_at)
├── stock (id, item_id, serial_number, asset_id, location, staff_id, deployment_location, deployment_date, created_at, updated_at)
└── stock_out (id, stock_id, item_id, item_name, item_category, item_brand, item_model, serial_number, asset_id, location, staff_id, deployment_location, deployment_date, stock_out_date, created_at)
```
