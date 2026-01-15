import React, { useState, useEffect } from 'react';
import { getInventory, getStats, getStockOut } from '../services/storage';

const Report = () => {
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({ totalItems: 0, pcs: 0, laptops: 0, totalQuantity: 0 });
  const [reportType, setReportType] = useState('summary');
  const [stockOutList, setStockOutList] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const inv = await getInventory();
    const statsData = await getStats();
    const so = await getStockOut();
    setInventory(inv || []);
    setStats(statsData || { totalItems: 0, pcs: 0, laptops: 0, totalQuantity: 0 });
    setStockOutList(so || []);
  };

  const renderReportTable = () => {
    if (reportType === 'summary') {
      return (
        <table className="report-table">
          <thead>
            <tr><th>Metric</th><th>Value</th></tr>
          </thead>
          <tbody>
            <tr><td>Total Items</td><td>{stats.totalItems}</td></tr>
            <tr><td>PCs</td><td>{stats.pcs}</td></tr>
            <tr><td>Laptops</td><td>{stats.laptops}</td></tr>
            <tr><td>Total Stock Units</td><td>{stats.totalQuantity}</td></tr>
          </tbody>
        </table>
      );
    }

    if (reportType === 'detailed') {
      return (
        <table className="report-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Stock Quantity</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.brand}</td>
                <td>{item.model}</td>
                <td>{item.quantity || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (reportType === 'low-stock') {
      const lowStockItems = inventory.filter(item => (item.quantity || 0) === 0);
      return (
        <table className="report-table">
          <thead>
            <tr><th>Item Name</th><th>Category</th><th>Brand</th><th>Model</th></tr>
          </thead>
          <tbody>
            {lowStockItems.length === 0 ? (
              <tr><td colSpan={4}>No items with zero stock</td></tr>
            ) : (
              lowStockItems.map(item => (
                <tr key={item.id}><td>{item.name}</td><td>{item.category}</td><td>{item.brand}</td><td>{item.model}</td></tr>
              ))
            )}
          </tbody>
        </table>
      );
    }

    // stock-out
    const entries = stockOutList || [];
    return (
      <table className="report-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Serial Number</th>
            <th>Asset ID</th>
            <th>Location</th>
            <th>Staff ID</th>
            <th>Deployment Location</th>
            <th>Deployment Date</th>
            <th>Stock Out Date</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr><td colSpan={11}>No stock out entries</td></tr>
          ) : (
            entries.map(e => (
              <tr key={e.id}>
                <td>{e.item_name || 'N/A'}</td>
                <td>{e.item_category || 'N/A'}</td>
                <td>{e.item_brand || 'N/A'}</td>
                <td>{e.item_model || 'N/A'}</td>
                <td>{e.serial_number || 'N/A'}</td>
                <td>{e.asset_id || 'N/A'}</td>
                <td>{e.location || 'N/A'}</td>
                <td>{e.staff_id || 'N/A'}</td>
                <td>{e.deployment_location || 'N/A'}</td>
                <td>{e.deployment_date ? new Date(e.deployment_date).toLocaleDateString() : 'N/A'}</td>
                <td>{e.stock_out_date ? new Date(e.stock_out_date).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  };

  const generateCSV = () => {
    let csv = '';
    if (reportType === 'summary') {
      csv = 'Metric,Value\nTotal Items,' + stats.totalItems + '\nPCs,' + stats.pcs + '\nLaptops,' + stats.laptops + '\nTotal Stock Units,' + stats.totalQuantity;
    } else if (reportType === 'detailed') {
      const headers = ['Item Name','Category','Brand','Model','Stock Quantity'];
      csv += headers.join(',') + '\n';
      (inventory || []).forEach(item => {
        const line = [item.name, item.category, item.brand, item.model, item.quantity || 0]
          .map(v => `"${(v || '').toString().replace(/"/g, '""')}"`).join(',');
        csv += line + '\n';
      });
    } else if (reportType === 'low-stock') {
      const lowStockItems = inventory.filter(item => (item.quantity || 0) === 0);
      csv = 'Item Name,Category,Brand,Model\n';
      lowStockItems.forEach(item => {
        csv += `"${item.name}","${item.category}","${item.brand}","${item.model}"\n`;
      });
    } else {
      // stock-out
      const rows = stockOutList || [];
      const headers = ['Item Name','Category','Brand','Model','Serial Number','Asset ID','Location','Staff ID','Deployment Location','Deployment Date','Stock Out Date'];
      csv += headers.join(',') + '\n';
      rows.forEach(r => {
        const line = [r.item_name, r.item_category, r.item_brand, r.item_model, r.serial_number, r.asset_id, r.location, r.staff_id, r.deployment_location, r.deployment_date, r.stock_out_date]
          .map(v => `"${(v || '').toString().replace(/"/g, '""')}"`).join(',');
        csv += line + '\n';
      });
    }
    return csv;
  };

  const handleExportSheet = () => {
    const csv = generateCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${reportType}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateHTMLTable = () => {
    if (reportType === 'summary') {
      return `<table border="1" cellspacing="0" cellpadding="6"><tr><th>Metric</th><th>Value</th></tr><tr><td>Total Items</td><td>${stats.totalItems}</td></tr><tr><td>PCs</td><td>${stats.pcs}</td></tr><tr><td>Laptops</td><td>${stats.laptops}</td></tr><tr><td>Total Stock Units</td><td>${stats.totalQuantity}</td></tr></table>`;
    } else if (reportType === 'detailed') {
      let html = `<table border="1" cellspacing="0" cellpadding="6"><tr><th>Item Name</th><th>Category</th><th>Brand</th><th>Model</th><th>Stock Quantity</th></tr>`;
      (inventory || []).forEach(item => {
        html += `<tr><td>${item.name}</td><td>${item.category}</td><td>${item.brand}</td><td>${item.model}</td><td>${item.quantity || 0}</td></tr>`;
      });
      html += '</table>';
      return html;
    } else if (reportType === 'low-stock') {
      const lowStockItems = inventory.filter(item => (item.quantity || 0) === 0);
      let html = `<table border="1" cellspacing="0" cellpadding="6"><tr><th>Item Name</th><th>Category</th><th>Brand</th><th>Model</th></tr>`;
      if (lowStockItems.length > 0) {
        lowStockItems.forEach(item => {
          html += `<tr><td>${item.name}</td><td>${item.category}</td><td>${item.brand}</td><td>${item.model}</td></tr>`;
        });
      } else {
        html += '<tr><td colspan="4">No items with zero stock</td></tr>';
      }
      html += '</table>';
      return html;
    }
    // stock-out
    const rows = stockOutList || [];
    let html = `<table border="1" cellspacing="0" cellpadding="6"><tr><th>Item Name</th><th>Category</th><th>Brand</th><th>Model</th><th>Serial</th><th>Asset</th><th>Location</th><th>Staff ID</th><th>Deployment Location</th><th>Deployment Date</th><th>Stock Out Date</th></tr>`;
    rows.forEach(r => {
      html += `<tr><td>${r.item_name || ''}</td><td>${r.item_category || ''}</td><td>${r.item_brand || ''}</td><td>${r.item_model || ''}</td><td>${r.serial_number || ''}</td><td>${r.asset_id || ''}</td><td>${r.location || ''}</td><td>${r.staff_id || ''}</td><td>${r.deployment_location || ''}</td><td>${r.deployment_date ? new Date(r.deployment_date).toLocaleDateString() : ''}</td><td>${r.stock_out_date ? new Date(r.stock_out_date).toLocaleDateString() : ''}</td></tr>`;
    });
    html += '</table>';
    return html;
  };

  const handleExportPDF = () => {
    const html = generateHTMLTable();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Report</title>
          <style>body{font-family:Arial,Helvetica,sans-serif;padding:20px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:6px;text-align:left}</style>
        </head>
        <body>
          <h1>${reportType.toUpperCase()} Report</h1>
          ${html}
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
            <option value="stock-out">Stock Out Report</option>
          </select>
        </div>

        <div className="report-actions">
          <button className="btn btn-primary" onClick={handleExportSheet}>
            📄 Export Sheet (CSV)
          </button>
          <button className="btn btn-secondary" onClick={handleExportPDF}>
            🖨️ Export PDF
          </button>
        </div>
      </div>

      <div className="report-preview">
        <h2>Report Preview</h2>
        <div className="report-content">{renderReportTable()}</div>
      </div>
    </div>
  );
};

export default Report;
