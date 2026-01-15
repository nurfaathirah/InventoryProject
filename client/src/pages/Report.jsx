import React, { useState, useEffect } from 'react';
import { getInventory, getStats, getStockOut, getCurrentUser } from '../services/storage';
import { getCurrentUser as fetchCurrentUser } from '../services/api';
import './Report.css';

const Report = () => {
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({ totalItems: 0, pcs: 0, laptops: 0, totalQuantity: 0 });
  const [reportType, setReportType] = useState('summary');
  const [stockOutList, setStockOutList] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: 'User',
    email: 'user@beyond2u.com',
    companyName: 'Beyond2u Sdn Bhd'
  });

  useEffect(() => {
    const loadUserData = async () => {
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.id) {
        try {
          const serverUser = await fetchCurrentUser(currentUser.id);
          if (serverUser && serverUser.success && serverUser.user) {
            setUserInfo({
              name: serverUser.user.name || currentUser.name || 'User',
              email: serverUser.user.email || currentUser.email || 'user@beyond2u.com',
              companyName: 'Beyond2u Sdn Bhd'
            });
          } else if (currentUser) {
            setUserInfo({
              name: currentUser.name || currentUser.username || 'User',
              email: currentUser.email || 'user@beyond2u.com',
              companyName: 'Beyond2u Sdn Bhd'
            });
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          if (currentUser) {
            setUserInfo({
              name: currentUser.name || currentUser.username || 'User',
              email: currentUser.email || 'user@beyond2u.com',
              companyName: 'Beyond2u Sdn Bhd'
            });
          }
        }
      }
      loadData();
    };
    loadUserData();
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
      // Group items by category
      const pcItems = inventory.filter(item => item.category && item.category.toLowerCase().includes('pc'));
      const laptopItems = inventory.filter(item => item.category && item.category.toLowerCase().includes('laptop'));
      const totalPcStock = pcItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
      const totalLaptopStock = laptopItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

      return (
        <div className="report-container">
          <div className="report-header">
            <h1 className="report-title">Professional Inventory Summary Report</h1>
            <div className="report-info">
              <p><strong>Prepared by:</strong> {userInfo.name}</p>
              <p><strong>Email:</strong> {userInfo.email}</p>
              <p><strong>Company Name:</strong> {userInfo.companyName}</p>
              <p><strong>Date Prepared:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <hr />
          </div>
          <h2 className="report-section-title">Inventory Summary</h2>
          <table className="report-table professional-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Item Name</th>
                <th>Stock Count</th>
              </tr>
            </thead>
            <tbody>
              {pcItems.length > 0 && (
                <>
                  {pcItems.map((item, idx) => (
                    <tr key={item.id}>
                      {idx === 0 && <td rowSpan={pcItems.length}><strong>PC</strong></td>}
                      <td>{item.name}</td>
                      <td><strong>{item.quantity || 0}</strong></td>
                    </tr>
                  ))}
                  <tr className="highlight-row">
                    <td colSpan={2}><strong>Total PC Stock</strong></td>
                    <td><strong>{totalPcStock}</strong></td>
                  </tr>
                </>
              )}
              {laptopItems.length > 0 && (
                <>
                  {laptopItems.map((item, idx) => (
                    <tr key={item.id}>
                      {idx === 0 && <td rowSpan={laptopItems.length}><strong>Laptop</strong></td>}
                      <td>{item.name}</td>
                      <td><strong>{item.quantity || 0}</strong></td>
                    </tr>
                  ))}
                  <tr className="highlight-row">
                    <td colSpan={2}><strong>Total Laptop Stock</strong></td>
                    <td><strong>{totalLaptopStock}</strong></td>
                  </tr>
                </>
              )}
              <tr className="highlight-row" style={{backgroundColor: '#c8e6c9'}}>
                <td colSpan={2}><strong>Grand Total</strong></td>
                <td><strong>{totalPcStock + totalLaptopStock}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    if (reportType === 'detailed') {
      return (
        <div className="report-container">
          <div className="report-header">
            <h1 className="report-title">Professional Detailed Inventory Report</h1>
            <div className="report-info">
              <p><strong>Prepared by:</strong> {userInfo.name}</p>
              <p><strong>Email:</strong> {userInfo.email}</p>
              <p><strong>Company Name:</strong> {userInfo.companyName}</p>
              <p><strong>Date Prepared:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <hr />
          </div>
          <h2 className="report-section-title">Detailed Inventory Listing</h2>
          {inventory.length > 0 ? inventory.map((item, idx) => (
            <div key={item.id} className="item-section">
              <div className="item-details">
                <div className="item-info-row">
                  <span className="item-label">Item Name:</span>
                  <span className="item-value">{item.name}</span>
                </div>
                <div className="item-info-row">
                  <span className="item-label">Brand:</span>
                  <span className="item-value">{item.brand}</span>
                </div>
                <div className="item-info-row">
                  <span className="item-label">Model:</span>
                  <span className="item-value">{item.model}</span>
                </div>
                <div className="item-info-row">
                  <span className="item-label">Stock Count:</span>
                  <span className="item-value"><strong>{item.quantity || 0}</strong></span>
                </div>
              </div>
              {item.stock && item.stock.length > 0 && (
                <table className="report-table professional-table">
                  <thead>
                    <tr>
                      <th>Asset ID</th>
                      <th>Serial Number</th>
                      <th>Date Restock</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.stock.map((stock, stockIdx) => (
                      <tr key={stock.id || stockIdx}>
                        <td>{stock.asset_id || 'N/A'}</td>
                        <td>{stock.serial_number || 'N/A'}</td>
                        <td>{stock.created_at ? new Date(stock.created_at).toLocaleDateString() : 'N/A'}</td>
                        <td>{stock.location || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )) : (
            <div className="text-center">No items found</div>
          )}
        </div>
      );
    }

    if (reportType === 'low-stock') {
      const lowStockItems = inventory.filter(item => (item.quantity || 0) === 0);
      return (
        <div className="report-container">
          <div className="report-header">
            <h1 className="report-title">Professional Low Stock Alert Report</h1>
            <div className="report-info">
              <p><strong>Prepared by:</strong> {userInfo.name}</p>
              <p><strong>Email:</strong> {userInfo.email}</p>
              <p><strong>Company Name:</strong> {userInfo.companyName}</p>
              <p><strong>Date Prepared:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <hr />
          </div>
          <h2 className="report-section-title">Items with Zero Stock ({lowStockItems.length})</h2>
          <table className="report-table professional-table">
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.length === 0 ? (
                <tr><td colSpan={6} className="text-center success">✓ All items are in stock</td></tr>
              ) : (
                lowStockItems.map((item, idx) => (
                  <tr key={item.id} className="alert-row">
                    <td>{idx + 1001}</td>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.category}</td>
                    <td>{item.brand}</td>
                    <td>{item.model}</td>
                    <td><span className="alert-badge">OUT OF STOCK</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      );
    }

    // stock-out
    const entries = stockOutList || [];
    return (
      <div className="report-container">
        <div className="report-header">
          <h1 className="report-title">Professional Stock Out Deployment Report</h1>
          <div className="report-info">
            <p><strong>Prepared by:</strong> {userInfo.name}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p><strong>Company Name:</strong> {userInfo.companyName}</p>
            <p><strong>Date Prepared:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <hr />
        </div>
        <h2 className="report-section-title">Deployed Stock Items ({entries.length})</h2>
        <table className="report-table professional-table">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Serial Number</th>
              <th>Asset ID</th>
              <th>Staff ID</th>
              <th>Deployment Location</th>
              <th>Deployment Date</th>
              <th>Stock Out Date</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr><td colSpan={9} className="text-center">No stock out entries</td></tr>
            ) : (
              entries.map((e, idx) => (
                <tr key={e.id}>
                  <td>{idx + 2001}</td>
                  <td>{e.item_name || 'N/A'}</td>
                  <td>{e.item_category || 'N/A'}</td>
                  <td>{e.serial_number || 'N/A'}</td>
                  <td>{e.asset_id || 'N/A'}</td>
                  <td><strong>{e.staff_id || 'N/A'}</strong></td>
                  <td>{e.deployment_location || 'N/A'}</td>
                  <td>{e.deployment_date ? new Date(e.deployment_date).toLocaleDateString() : 'N/A'}</td>
                  <td>{e.stock_out_date ? new Date(e.stock_out_date).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const generateCSV = () => {
    let csv = '';
    if (reportType === 'summary') {
      csv = 'Metric,Value\nTotal Items,' + stats.totalItems + '\nPCs,' + stats.pcs + '\nLaptops,' + stats.laptops + '\nTotal Stock Units,' + stats.totalQuantity;
    } else if (reportType === 'detailed') {
      const headers = ['Item Name','Brand','Model','Stock Quantity','Asset ID','Serial Number','Date Restock','Location'];
      csv += headers.join(',') + '\n';
      (inventory || []).forEach(item => {
        if (item.stock && item.stock.length > 0) {
          item.stock.forEach(stock => {
            const line = [item.name, item.brand, item.model, item.quantity || 0, stock.asset_id || 'N/A', stock.serial_number || 'N/A', stock.created_at ? new Date(stock.created_at).toLocaleDateString() : 'N/A', stock.location || 'N/A']
              .map(v => `"${(v || '').toString().replace(/"/g, '""')}"`).join(',');
            csv += line + '\n';
          });
        } else {
          const line = [item.name, item.brand, item.model, item.quantity || 0, 'N/A', 'N/A', 'N/A', 'N/A']
            .map(v => `"${(v || '').toString().replace(/"/g, '""')}"`).join(',');
          csv += line + '\n';
        }
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
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const headerHTML = `
      <div style="margin-bottom: 30px; padding-bottom: 20px;">
        <h1 style="font-size: 24px; font-weight: bold; color: #1a3a3a; text-align: center; margin: 0 0 20px 0;">Professional Inventory Report</h1>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 15px; font-size: 13px;">
          <p><strong>Prepared by:</strong> ${userInfo.name}</p>
          <p><strong>Email:</strong> ${userInfo.email}</p>
          <p><strong>Company Name:</strong> ${userInfo.companyName}</p>
          <p><strong>Date Prepared:</strong> ${dateStr}</p>
          <p><strong>Report Type:</strong> ${reportType.toUpperCase()}</p>
        </div>
        <hr style="border: none; border-top: 2px solid #2d5016; margin: 20px 0;" />
      </div>
    `;

    if (reportType === 'summary') {
      const tableHTML = `
        <h2 style="font-size: 18px; font-weight: 600; color: #1a3a3a; margin: 25px 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #e0e0e0;">Inventory Summary</h2>
        <table border="1" cellspacing="0" cellpadding="12" style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead style="background-color: #2d5016; color: white;">
            <tr>
              <th style="padding: 12px 15px; text-align: left; font-weight: 600; border: 1px solid #2d5016;">Metric</th>
              <th style="padding: 12px 15px; text-align: left; font-weight: 600; border: 1px solid #2d5016;">Count</th>
              <th style="padding: 12px 15px; text-align: left; font-weight: 600; border: 1px solid #2d5016;">Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 12px 15px; border: 1px solid #ddd;">Total Items</td>
              <td style="padding: 12px 15px; border: 1px solid #ddd;">${stats.totalItems}</td>
              <td style="padding: 12px 15px; border: 1px solid #ddd;">100%</td>
            </tr>
            <tr>
              <td style="padding: 12px 15px; border: 1px solid #ddd;">PCs</td>
              <td style="padding: 12px 15px; border: 1px solid #ddd;">${stats.pcs}</td>
              <td style="padding: 12px 15px; border: 1px solid #ddd;">${stats.totalItems > 0 ? ((stats.pcs / stats.totalItems) * 100).toFixed(1) : 0}%</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 12px 15px; border: 1px solid #ddd;">Laptops</td>
              <td style="padding: 12px 15px; border: 1px solid #ddd;">${stats.laptops}</td>
              <td style="padding: 12px 15px; border: 1px solid #ddd;">${stats.totalItems > 0 ? ((stats.laptops / stats.totalItems) * 100).toFixed(1) : 0}%</td>
            </tr>
            <tr style="background-color: #e8f5e9; font-weight: 600;">
              <td style="padding: 12px 15px; border: 1px solid #2d5016;"><strong>Total Stock Units</strong></td>
              <td style="padding: 12px 15px; border: 1px solid #2d5016;"><strong>${stats.totalQuantity}</strong></td>
              <td style="padding: 12px 15px; border: 1px solid #2d5016;"><strong>-</strong></td>
            </tr>
          </tbody>
        </table>
      `;
      return headerHTML + tableHTML;
    } else if (reportType === 'detailed') {
      let tableHTML = `
        <h2 style="font-size: 18px; font-weight: 600; color: #1a3a3a; margin: 25px 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #e0e0e0;">Detailed Inventory Listing</h2>
      `;
      if (inventory.length > 0) {
        inventory.forEach(item => {
          tableHTML += `
            <div style="margin-bottom: 20px; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #2d5016; border-radius: 4px;">
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 15px;">
                <div>
                  <div style="font-weight: 600; color: #1a3a3a; font-size: 12px; margin-bottom: 5px;">Item Name:</div>
                  <div style="color: #333; font-size: 13px;">${item.name}</div>
                </div>
                <div>
                  <div style="font-weight: 600; color: #1a3a3a; font-size: 12px; margin-bottom: 5px;">Brand:</div>
                  <div style="color: #333; font-size: 13px;">${item.brand}</div>
                </div>
                <div>
                  <div style="font-weight: 600; color: #1a3a3a; font-size: 12px; margin-bottom: 5px;">Model:</div>
                  <div style="color: #333; font-size: 13px;">${item.model}</div>
                </div>
                <div>
                  <div style="font-weight: 600; color: #1a3a3a; font-size: 12px; margin-bottom: 5px;">Stock Count:</div>
                  <div style="color: #333; font-size: 13px; font-weight: 600;">${item.quantity || 0}</div>
                </div>
              </div>
          `;
          if (item.stock && item.stock.length > 0) {
            tableHTML += `
              <table border="1" cellspacing="0" cellpadding="12" style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead style="background-color: #2d5016; color: white;">
                  <tr>
                    <th style="padding: 10px 12px; text-align: left; font-weight: 600; border: 1px solid #2d5016;">Asset ID</th>
                    <th style="padding: 10px 12px; text-align: left; font-weight: 600; border: 1px solid #2d5016;">Serial Number</th>
                    <th style="padding: 10px 12px; text-align: left; font-weight: 600; border: 1px solid #2d5016;">Date Restock</th>
                    <th style="padding: 10px 12px; text-align: left; font-weight: 600; border: 1px solid #2d5016;">Location</th>
                  </tr>
                </thead>
                <tbody>
            `;
            item.stock.forEach((stock, idx) => {
              const bgColor = idx % 2 === 0 ? '#f9f9f9' : 'white';
              tableHTML += `
                <tr style="background-color: ${bgColor};">
                  <td style="padding: 10px 12px; border: 1px solid #ddd;">${stock.asset_id || 'N/A'}</td>
                  <td style="padding: 10px 12px; border: 1px solid #ddd;">${stock.serial_number || 'N/A'}</td>
                  <td style="padding: 10px 12px; border: 1px solid #ddd;">${stock.created_at ? new Date(stock.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td style="padding: 10px 12px; border: 1px solid #ddd;">${stock.location || 'N/A'}</td>
                </tr>
              `;
            });
            tableHTML += `
                </tbody>
              </table>
            `;
          }
          tableHTML += `</div>`;
        });
      } else {
        tableHTML += `<div style="text-align: center; padding: 20px;">No items found</div>`;
      }
      return headerHTML + tableHTML;
    } else if (reportType === 'low-stock') {
      const lowStockItems = inventory.filter(item => (item.quantity || 0) === 0);
      let tableHTML = `
        <h2 style="font-size: 18px; font-weight: 600; color: #1a3a3a; margin: 25px 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #e0e0e0;">Items with Zero Stock (${lowStockItems.length})</h2>
        <table border="1" cellspacing="0" cellpadding="12" style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead style="background-color: #2d5016; color: white;">
            <tr>
              <th style="padding: 12px 15px; text-align: left; font-weight: 600; border: 1px solid #2d5016;">Item ID</th>
              <th style="padding: 12px 15px; text-align: left; font-weight: 600; border: 1px solid #2d5016;">Item Name</th>
              <th style="padding: 12px 15px; text-align: left; font-weight: 600; border: 1px solid #2d5016;">Category</th>
              <th style="padding: 12px 15px; text-align: left; font-weight: 600; border: 1px solid #2d5016;">Brand</th>
              <th style="padding: 12px 15px; text-align: left; font-weight: 600; border: 1px solid #2d5016;">Model</th>
              <th style="padding: 12px 15px; text-align: left; font-weight: 600; border: 1px solid #2d5016;">Status</th>
            </tr>
          </thead>
          <tbody>
      `;
      if (lowStockItems.length === 0) {
        tableHTML += `<tr><td colspan="6" style="text-align: center; padding: 12px 15px; border: 1px solid #ddd; color: #2d5016; font-weight: 600;">✓ All items are in stock</td></tr>`;
      } else {
        lowStockItems.forEach((item, idx) => {
          tableHTML += `
            <tr style="background-color: #ffebee; border: 1px solid #ef5350;">
              <td style="padding: 12px 15px; border: 1px solid #ef5350;">${idx + 1001}</td>
              <td style="padding: 12px 15px; border: 1px solid #ef5350; font-weight: 600;">${item.name}</td>
              <td style="padding: 12px 15px; border: 1px solid #ef5350;">${item.category}</td>
              <td style="padding: 12px 15px; border: 1px solid #ef5350;">${item.brand}</td>
              <td style="padding: 12px 15px; border: 1px solid #ef5350;">${item.model}</td>
              <td style="padding: 12px 15px; border: 1px solid #ef5350;"><span style="display: inline-block; background-color: #f44336; color: white; padding: 4px 10px; border-radius: 4px; font-weight: 600; font-size: 12px;">OUT OF STOCK</span></td>
            </tr>
          `;
        });
      }
      tableHTML += `</tbody></table>`;
      return headerHTML + tableHTML;
    }
    // stock-out
    const rows = stockOutList || [];
    let tableHTML = `
      <h2 style="font-size: 18px; font-weight: 600; color: #1a3a3a; margin: 25px 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #e0e0e0;">Deployed Stock Items (${rows.length})</h2>
      <table border="1" cellspacing="0" cellpadding="12" style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <thead style="background-color: #2d5016; color: white;">
          <tr>
            <th style="padding: 12px 15px; text-align: left; font-weight: 600; border: 1px solid #2d5016;">Item ID</th>
            <th style="padding: 12px 15px; text-align: left; font-weight: 600; border: 1px solid #2d5016;">Item Name</th>
            <th style="padding: 12px 15px; text-align: left; font-weight: 600; border: 1px solid #2d5016;">Serial Number</th>
            <th style="padding: 12px 15px; text-align: left; font-weight: 600; border: 1px solid #2d5016;">Staff ID</th>
            <th style="padding: 12px 15px; text-align: left; font-weight: 600; border: 1px solid #2d5016;">Deployment Location</th>
            <th style="padding: 12px 15px; text-align: left; font-weight: 600; border: 1px solid #2d5016;">Deployment Date</th>
            <th style="padding: 12px 15px; text-align: left; font-weight: 600; border: 1px solid #2d5016;">Stock Out Date</th>
          </tr>
        </thead>
        <tbody>
    `;
    if (rows.length === 0) {
      tableHTML += `<tr><td colspan="7" style="text-align: center; padding: 12px 15px; border: 1px solid #ddd;">No stock out entries</td></tr>`;
    } else {
      rows.forEach((e, idx) => {
        const bgColor = idx % 2 === 0 ? '#f9f9f9' : 'white';
        tableHTML += `
          <tr style="background-color: ${bgColor};">
            <td style="padding: 12px 15px; border: 1px solid #ddd;">${idx + 2001}</td>
            <td style="padding: 12px 15px; border: 1px solid #ddd;">${e.item_name || 'N/A'}</td>
            <td style="padding: 12px 15px; border: 1px solid #ddd;">${e.serial_number || 'N/A'}</td>
            <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: 600;">${e.staff_id || 'N/A'}</td>
            <td style="padding: 12px 15px; border: 1px solid #ddd;">${e.deployment_location || 'N/A'}</td>
            <td style="padding: 12px 15px; border: 1px solid #ddd;">${e.deployment_date ? new Date(e.deployment_date).toLocaleDateString() : 'N/A'}</td>
            <td style="padding: 12px 15px; border: 1px solid #ddd;">${e.stock_out_date ? new Date(e.stock_out_date).toLocaleDateString() : 'N/A'}</td>
          </tr>
        `;
      });
    }
    tableHTML += `</tbody></table>`;
    return headerHTML + tableHTML;
  };

  const handleExportPDF = () => {
    const html = generateHTMLTable();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Inventory Report</title>
          <style>
            body {
              font-family: Arial, Helvetica, sans-serif;
              padding: 20px;
              line-height: 1.6;
            }
            h1 { color: #1a3a3a; }
            h2 { color: #1a3a3a; }
          </style>
        </head>
        <body>
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
