import React, { useState, useEffect } from 'react';
import './InventoryList.css';

const InventoryList = ({ inventory, onUpdateStock, onEditStock, expandedItemId = null, highlightedAssetOrSerial = '' }) => {
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    if (expandedItemId) {
      setExpandedItems({ [expandedItemId]: true });
    }
  }, [expandedItemId]);

  const toggleExpand = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  if (inventory.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <h2>No items found</h2>
        <p>Add your first PC or Laptop to get started!</p>
      </div>
    );
  }

  return (
    <div className="inventory-list">
      {inventory.map((item) => (
        <div key={item.id} className="inventory-card">
          <div className="card-header">
            <div className="card-title">
              <span className="category-badge">{item.category}</span>
              <h3>{item.name}</h3>
            </div>
            <div className="card-actions">
              <button
                className="btn-icon btn-update-stock"
                onClick={() => onUpdateStock(item)}
                title="Update Stock"
              >
                📦
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="card-row">
              <div className="card-field">
                <span className="field-label">Brand:</span>
                <span className="field-value">{item.brand}</span>
              </div>
              <div className="card-field">
                <span className="field-label">Model:</span>
                <span className="field-value">{item.model}</span>
              </div>
              <div className="card-field">
                <span className="field-label">Stock Quantity:</span>
                <span className={`field-value quantity ${item.quantity === 0 ? 'low-stock' : ''}`}>
                  {item.quantity || 0}
                </span>
              </div>
            </div>

            {item.stock && item.stock.length > 0 && (
              <div className="stock-section">
                <button
                  className="toggle-stock-btn"
                  onClick={() => toggleExpand(item.id)}
                >
                  {expandedItems[item.id] ? '▼' : '▶'} View Stock Details ({item.stock.length} units)
                </button>
                {expandedItems[item.id] && (
                  <div className="stock-details">
                    <table className="stock-table">
                      <thead>
                        <tr>
                          <th>Serial Number</th>
                          <th>Asset ID</th>
                          <th>Location</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.stock.map((stockEntry) => {
                          const isHighlighted = highlightedAssetOrSerial && (
                            (stockEntry.asset_id && stockEntry.asset_id.toLowerCase().includes(highlightedAssetOrSerial.toLowerCase())) ||
                            (stockEntry.serial_number && stockEntry.serial_number.toLowerCase().includes(highlightedAssetOrSerial.toLowerCase()))
                          );
                          return (
                            <tr key={stockEntry.id} className={isHighlighted ? 'highlighted' : ''}>
                              <td>{stockEntry.serial_number || 'N/A'}</td>
                              <td>{stockEntry.asset_id || 'N/A'}</td>
                              <td>📍 {stockEntry.location || 'N/A'}</td>
                              <td>
                                <button
                                  className="btn-edit-stock"
                                  onClick={() => onEditStock(stockEntry, item)}
                                  title="Edit Details"
                                >
                                  ✏️ Edit Details
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryList;
