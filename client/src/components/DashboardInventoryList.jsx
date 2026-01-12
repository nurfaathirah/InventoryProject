import React from 'react';
import './InventoryList.css';

const DashboardInventoryList = ({ inventory }) => {
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardInventoryList;
