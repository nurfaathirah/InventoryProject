# Migration Guide: localStorage to MySQL

This guide helps you switch from localStorage to MySQL database.

## Current State

The application currently uses **localStorage** for data storage. All data is stored in the browser.

## Migration Steps

### Step 1: Setup Database

1. **Start XAMPP MySQL**
   - Open XAMPP Control Panel
   - Start MySQL service

2. **Create Database**
   - Open phpMyAdmin: `http://localhost/phpmyadmin`
   - Run `server/database/schema.sql`
   - Database `inventory_management` will be created

### Step 2: Start Backend Server

```bash
cd server
npm install
npm start
```

Server runs on `http://localhost:3001`

### Step 3: Update Frontend to Use API

You have two options:

#### Option A: Replace storage.js with API calls

1. Update `client/src/services/storage.js` to use `api.js`:

```javascript
// Change from localStorage functions to API calls
import * as api from './api';

export const getItems = async () => {
  return await api.getItems();
};

export const addItem = async (item) => {
  return await api.addItem(item);
};

// ... etc for all functions
```

2. Update all components to handle async/await:

```javascript
// Before (synchronous)
const items = getItems();

// After (asynchronous)
const items = await getItems();
```

#### Option B: Create Hybrid Service (Recommended)

Create a service that tries API first, falls back to localStorage:

```javascript
// client/src/services/hybridStorage.js
import * as api from './api';
import * as local from './storage';

const USE_API = true; // Set to true to use MySQL

export const getItems = async () => {
  if (USE_API) {
    try {
      return await api.getItems();
    } catch (error) {
      console.error('API failed, using localStorage:', error);
      return local.getItems();
    }
  }
  return local.getItems();
};
```

### Step 4: Update Components

All components using storage functions need to be updated:

1. **Add async/await** to useEffect hooks
2. **Handle loading states**
3. **Handle errors**

Example:

```javascript
// Before
useEffect(() => {
  const items = getItems();
  setItems(items);
}, []);

// After
useEffect(() => {
  const loadItems = async () => {
    try {
      const items = await getItems();
      setItems(items);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };
  loadItems();
}, []);
```

### Step 5: Migrate Existing Data (Optional)

If you have existing localStorage data:

1. Export localStorage data:
```javascript
// Run in browser console
const items = JSON.parse(localStorage.getItem('inventory_items'));
const stock = JSON.parse(localStorage.getItem('inventory_stock'));
console.log(JSON.stringify({ items, stock }, null, 2));
```

2. Create migration script or manually insert via API:
```javascript
// Migration script
items.forEach(async (item) => {
  await api.addItem(item);
});

stock.forEach(async (entry) => {
  await api.addStockEntries(entry.item_id, [{
    serial_number: entry.serial_number,
    asset_id: entry.asset_id,
    location: entry.location
  }]);
});
```

## Testing

1. **Test API Connection**
   - Open: `http://localhost:3001/api/health`
   - Should return: `{"success":true,"message":"Server is running"}`

2. **Test Endpoints**
   - `GET /api/items` - Should return items array
   - `GET /api/inventory` - Should return inventory with stock

3. **Test Frontend**
   - Start frontend: `npm run dev`
   - Try adding an item
   - Check database to verify it was saved

## Troubleshooting

### API Connection Failed
- Check if backend server is running
- Verify CORS is enabled in `server.js`
- Check API_BASE_URL in `api.js`

### Data Not Saving
- Check browser console for errors
- Verify database connection in `connection.js`
- Check MySQL is running in XAMPP

### CORS Errors
- Ensure backend server is running
- Check `cors()` middleware is enabled in `server.js`

## Rollback

To rollback to localStorage:
1. Set `USE_API = false` in hybrid service
2. Or revert `storage.js` changes
3. Data will be read from localStorage again

## Benefits of MySQL

- ✅ Persistent data across browsers
- ✅ Multi-user support
- ✅ Better data integrity
- ✅ Scalability
- ✅ Backup and restore capabilities
- ✅ Advanced queries and reporting
