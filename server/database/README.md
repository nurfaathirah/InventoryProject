# Database Setup

## Quick Setup for XAMPP

1. **Start XAMPP MySQL**
   - Open XAMPP Control Panel
   - Start MySQL service

2. **Create Database**
   - Open phpMyAdmin: `http://localhost/phpmyadmin`
   - Click on "SQL" tab
   - Copy and paste contents of `schema.sql`
   - Click "Go"

3. **Verify**
   - Check that database `inventory_management` exists
   - Verify tables: `users`, `items`, `stock`, `stock_out`
   - Check sample data was inserted

## Database Configuration

Default XAMPP MySQL settings:
- Host: `localhost`
- User: `root`
- Password: `` (empty)
- Database: `inventory_management`
- Port: `3306`

If you changed the MySQL root password, update `connection.js`:
```javascript
password: 'your_password'
```

## Tables Structure

### users
- Stores user accounts for login/signup
- Fields: id, name, email, password, timestamps

### items
- Stores PC/Laptop item definitions
- Fields: id, name, category (PC/Laptop), brand, model, timestamps

### stock
- Stores individual stock entries
- Fields: id, item_id, serial_number, asset_id, location, staff_id, deployment_location, deployment_date, timestamps
- Foreign key: item_id → items.id

### stock_out
- Stores deployed stock entries
- Fields: id, stock_id, item_id, item details, deployment info, stock_out_date, timestamps
- Foreign key: item_id → items.id

## Sample Data

The schema includes sample data:
- 1 admin user
- 3 sample items (Dell PC, HP Laptop, Lenovo Laptop)
- 4 sample stock entries

## Backup & Restore

### Backup Database
```bash
mysqldump -u root -p inventory_management > backup.sql
```

### Restore Database
```bash
mysql -u root -p inventory_management < backup.sql
```

Or use phpMyAdmin Export/Import feature.
