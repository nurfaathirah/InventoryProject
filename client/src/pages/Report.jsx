import React, { useState, useEffect } from 'react';
import StatsCard from '../components/StatsCard';
import { getInventory, getStats } from '../services/storage';

const Report = () => {
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({ totalItems: 0, pcs: 0, laptops: 0, totalQuantity: 0 });
  const [reportType, setReportType] = useState('summary');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    (async () => {
      const inv = await getInventory();
      const statsData = await getStats();
      setInventory(inv || []);
      setStats(statsData || { totalItems: 0, pcs: 0, laptops: 0, totalQuantity: 0 });
    })();
  };

  const generateReport = () => {
    let reportContent = '';

    if (reportType === 'summary') {
      reportContent = `INVENTORY SUMMARY REPORT
Generated: ${new Date().toLocaleString()}

OVERVIEW:
- Total Items: ${stats.totalItems}
- PCs: ${stats.pcs}
- Laptops: ${stats.laptops}
- Total Stock Units: ${stats.totalQuantity}

`;
    } else if (reportType === 'detailed') {
      reportContent = `DETAILED INVENTORY REPORT
Generated: ${new Date().toLocaleString()}

${inventory.map(item => `
Item: ${item.name}
Category: ${item.category}
Brand: ${item.brand}
Model: ${item.model}
Stock Quantity: ${item.quantity || 0}
${item.stock && item.stock.length > 0 ? `
Stock Details:
${item.stock.map((s, idx) => `  ${idx + 1}. Serial: ${s.serial_number || 'N/A'}, Asset ID: ${s.asset_id || 'N/A'}, Location: ${s.location || 'N/A'}`).join('\n')}
` : '  No stock entries'}
${'='.repeat(50)}
`).join('\n')}`;
    } else if (reportType === 'low-stock') {
      const lowStockItems = inventory.filter(item => (item.quantity || 0) === 0);
      reportContent = `LOW STOCK REPORT
Generated: ${new Date().toLocaleString()}

Items with zero stock: ${lowStockItems.length}

${lowStockItems.length > 0 ? lowStockItems.map(item => `
- ${item.name} (${item.category})
  Brand: ${item.brand}, Model: ${item.model}
`).join('\n') : 'No items with zero stock'}
`;
    }

    return reportContent;
  };

  const handleExport = () => {
    const report = generateReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const report = generateReport();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Inventory Report</title>
          <style>
            body { font-family: monospace; padding: 20px; white-space: pre-wrap; }
            h1 { color: #2d5016; }
          </style>
        </head>
        <body>
          <h1>Inventory Report</h1>
          <pre>${report}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="report-page">
      <header className="page-header">
        <h1>📊 Reports</h1>
        <p>Generate and export inventory reports</p>
      </header>

      <StatsCard stats={stats} />

      <div className="report-controls">
        <div className="report-type-selector">
          <label htmlFor="reportType">Report Type:</label>
          <select
            id="reportType"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="report-select"
          >
            <option value="summary">Summary Report</option>
            <option value="detailed">Detailed Report</option>
            <option value="low-stock">Low Stock Report</option>
          </select>
        </div>

        <div className="report-actions">
          <button className="btn btn-primary" onClick={handleExport}>
            📥 Export Report
          </button>
          <button className="btn btn-secondary" onClick={handlePrint}>
            🖨️ Print Report
          </button>
        </div>
      </div>

      <div className="report-preview">
        <h2>Report Preview</h2>
        <pre className="report-content">{generateReport()}</pre>
      </div>
    </div>
  );
};

export default Report;
