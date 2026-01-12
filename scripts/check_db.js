(async () => {
  try {
    const pool = require('../server/database/connection');
    const [[{itemsCount}]] = await pool.execute('SELECT COUNT(*) AS itemsCount FROM items');
    const [[{stockCount}]] = await pool.execute('SELECT COUNT(*) AS stockCount FROM stock');
    const [[{stockOutCount}]] = await pool.execute('SELECT COUNT(*) AS stockOutCount FROM stock_out');
    console.log('items:', itemsCount, 'stock:', stockCount, 'stock_out:', stockOutCount);
    process.exit(0);
  } catch (err) {
    console.error('DB check error', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
