const fs = require('fs');
(async () => {
  try {
    const pool = require('../server/database/connection');
    const [[{itemsCount}]] = await pool.execute('SELECT COUNT(*) AS itemsCount FROM items');
    const [[{stockCount}]] = await pool.execute('SELECT COUNT(*) AS stockCount FROM stock');
    const [[{stockOutCount}]] = await pool.execute('SELECT COUNT(*) AS stockOutCount FROM stock_out');
    const out = { items: itemsCount, stock: stockCount, stock_out: stockOutCount };
    fs.writeFileSync('InventoryProject/scripts/check_db_result.json', JSON.stringify(out, null, 2));
    console.log('WROTE', JSON.stringify(out));
    process.exit(0);
  } catch (err) {
    fs.writeFileSync('InventoryProject/scripts/check_db_result.json', JSON.stringify({ error: err.message || err }));
    console.error('DB check error', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
