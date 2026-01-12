import React, { useState, useEffect } from 'react';
import './AddItemForm.css';
import './EditStockForm.css';

const EditStockForm = ({ stockEntry, item, onSubmit, onCancel, onDelete }) => {
  const [formData, setFormData] = useState({
    serial_number: '',
    asset_id: '',
    location: ''
  });

  useEffect(() => {
    if (stockEntry) {
      setFormData({
        serial_number: stockEntry.serial_number || '',
        asset_id: stockEntry.asset_id || '',
        location: stockEntry.location || ''
      });
    }
  }, [stockEntry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-overlay">
      <div className="form-container edit-stock-container">
        <div className="form-header">
          <h2>Edit Stock Details</h2>
          <button className="btn-close" onClick={onCancel}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="inventory-form">
          {item && (
            <div className="item-info-section">
              <div className="info-row">
                <div className="info-field">
                  <span className="info-label">Item:</span>
                  <span className="info-value">{item.name}</span>
                </div>
                <div className="info-field">
                  <span className="info-label">Category:</span>
                  <span className="info-value">{item.category}</span>
                </div>
              </div>
              <div className="info-row">
                <div className="info-field">
                  <span className="info-label">Brand:</span>
                  <span className="info-value">{item.brand}</span>
                </div>
                <div className="info-field">
                  <span className="info-label">Model:</span>
                  <span className="info-value">{item.model}</span>
                </div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="serial_number">Serial Number *</label>
            <input
              type="text"
              id="serial_number"
              name="serial_number"
              value={formData.serial_number}
              onChange={handleChange}
              required
              placeholder="Enter serial number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="asset_id">Asset ID *</label>
            <input
              type="text"
              id="asset_id"
              name="asset_id"
              value={formData.asset_id}
              onChange={handleChange}
              required
              placeholder="Enter asset ID"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., Warehouse A, Office 101"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-danger" 
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this stock entry?')) {
                  onDelete();
                }
              }}
            >
              🗑️ Delete
            </button>
            <div className="form-actions-right">
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                Update Details
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStockForm;
