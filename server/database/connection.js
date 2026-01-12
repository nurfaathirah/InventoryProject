const mysql = require('mysql2/promise');

// Database configuration for XAMPP
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Default XAMPP MySQL password is empty
  database: 'inventory_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.message);
    console.log('💡 Make sure XAMPP MySQL is running and database is created');
  });

module.exports = pool;
