const express = require('express');
const cors = require('cors');
const pool = require('./database/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== USERS API ====================

// Register user
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password] // In production, hash the password
    );
    res.json({ success: true, userId: result.insertId, name });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Login user
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.execute(
      'SELECT id, name, email FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    if (rows.length > 0) {
      res.json({ success: true, user: rows[0] });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get current user
app.get('/api/users/current', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.json({ success: true, user: null });
    }
    const [rows] = await pool.execute(
      'SELECT id, name, email FROM users WHERE id = ?',
      [userId]
    );
    res.json({ success: true, user: rows[0] || null });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ITEMS API ====================

// Get all items
app.get('/api/items', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM items ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new item
app.post('/api/items', async (req, res) => {
  try {
    const { name, category, brand, model } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO items (name, category, brand, model) VALUES (?, ?, ?, ?)',
      [name, category, brand, model]
    );
    const [newItem] = await pool.execute('SELECT * FROM items WHERE id = ?', [result.insertId]);
    res.json({ success: true, data: newItem[0] });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete item
app.delete('/api/items/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM items WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== STOCK API ====================

// Get all stock entries
app.get('/api/stock', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT s.*, i.name as item_name, i.category as item_category, 
       i.brand as item_brand, i.model as item_model 
       FROM stock s 
       JOIN items i ON s.item_id = i.id 
       ORDER BY s.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add stock entries
app.post('/api/stock', async (req, res) => {
  try {
    const { item_id, entries } = req.body;
    const insertPromises = entries.map(entry =>
      pool.execute(
        'INSERT INTO stock (item_id, serial_number, asset_id, location) VALUES (?, ?, ?, ?)',
        [item_id, entry.serial_number, entry.asset_id, entry.location]
      )
    );
    await Promise.all(insertPromises);
    const [newStock] = await pool.execute(
      `SELECT s.*, i.name as item_name, i.category as item_category, 
       i.brand as item_brand, i.model as item_model 
       FROM stock s 
       JOIN items i ON s.item_id = i.id 
       WHERE s.item_id = ? 
       ORDER BY s.created_at DESC LIMIT ?`,
      [item_id, entries.length]
    );
    res.json({ success: true, data: newStock });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update stock entry
app.put('/api/stock/:id', async (req, res) => {
  try {
    console.log('PUT /api/stock/:id', { params: req.params, body: req.body });
    // Coerce undefined -> null to avoid mysql2 bind errors
    const serial_number = req.body.serial_number ?? null;
    const asset_id = req.body.asset_id ?? null;
    const location = req.body.location ?? null;
    const staff_id = req.body.staff_id ?? null;
    const deployment_location = req.body.deployment_location ?? null;
    const deployment_date = req.body.deployment_date ?? null;
    await pool.execute(
      `UPDATE stock SET serial_number = ?, asset_id = ?, location = ?, 
       staff_id = ?, deployment_location = ?, deployment_date = ? 
       WHERE id = ?`,
      [serial_number, asset_id, location, staff_id, deployment_location, deployment_date, req.params.id]
    );
    const [updated] = await pool.execute(
      `SELECT s.*, i.name as item_name, i.category as item_category, 
       i.brand as item_brand, i.model as item_model 
       FROM stock s 
       JOIN items i ON s.item_id = i.id 
       WHERE s.id = ?`,
      [req.params.id]
    );
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete stock entry
app.delete('/api/stock/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM stock WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get inventory (items with stock)
app.get('/api/inventory', async (req, res) => {
  try {
    const [items] = await pool.execute('SELECT * FROM items ORDER BY created_at DESC');
    const [stock] = await pool.execute('SELECT * FROM stock');
    
    const inventory = items.map(item => {
      const itemStock = stock.filter(s => s.item_id === item.id);
      return {
        ...item,
        stock: itemStock,
        quantity: itemStock.length
      };
    });
    
    res.json({ success: true, data: inventory });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== STOCK OUT API ====================

// Get all stock out entries
app.get('/api/stock-out', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM stock_out ORDER BY stock_out_date DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add stock out entry (move from stock to stock_out)
app.post('/api/stock-out', async (req, res) => {
  try {
    console.log('POST /api/stock-out', { body: req.body });
    const stock_id = req.body.stock_id;
    const item_id = req.body.item_id;
    const staff_id = req.body.staff_id ?? null;
    const deployment_location = req.body.deployment_location ?? null;
    const deployment_date = req.body.deployment_date ?? null;
    
    // Get stock entry and item details
    const [stockEntry] = await pool.execute(
      `SELECT s.*, i.name as item_name, i.category as item_category, 
       i.brand as item_brand, i.model as item_model 
       FROM stock s 
       JOIN items i ON s.item_id = i.id 
       WHERE s.id = ?`,
      [stock_id]
    );
    
    if (stockEntry.length === 0) {
      return res.status(404).json({ success: false, error: 'Stock entry not found' });
    }
    
    const entry = stockEntry[0];
    
    // Insert into stock_out
    const [result] = await pool.execute(
      `INSERT INTO stock_out 
       (stock_id, item_id, item_name, item_category, item_brand, item_model, 
        serial_number, asset_id, location, staff_id, deployment_location, deployment_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        stock_id, item_id, entry.item_name, entry.item_category, entry.item_brand, entry.item_model,
        entry.serial_number, entry.asset_id, entry.location, staff_id, deployment_location, deployment_date
      ]
    );
    
    // Delete from stock
    await pool.execute('DELETE FROM stock WHERE id = ?', [stock_id]);
    
    const [newStockOut] = await pool.execute('SELECT * FROM stock_out WHERE id = ?', [result.insertId]);
    res.json({ success: true, data: newStockOut[0] });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ==================== STATS API ====================

// Get statistics
app.get('/api/stats', async (req, res) => {
  try {
    const [items] = await pool.execute('SELECT * FROM items');
    const [stock] = await pool.execute('SELECT * FROM stock');
    
    const stats = {
      totalItems: items.length,
      pcs: items.filter(item => item.category === 'PC').length,
      laptops: items.filter(item => item.category === 'Laptop').length,
      totalQuantity: stock.length
    };
    
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});
