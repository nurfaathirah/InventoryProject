import React, { useState, useEffect } from 'react';
import './AddItemForm.css';
import './UpdateStockForm.css';
import { getCurrentUser } from '../services/storage';

const UpdateStockForm = ({ items, preSelectedItem, onSubmit, onCancel }) => {
  const [selectedItemId, setSelectedItemId] = useState(preSelectedItem?.id || '');
  const [selectedItem, setSelectedItem] = useState(preSelectedItem || null);
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState('');
  const [stockEntries, setStockEntries] = useState([{ serial_number: '', asset_id: '' }]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (preSelectedItem) {
      setSelectedItemId(preSelectedItem.id);
      setSelectedItem(preSelectedItem);
    }
  }, [preSelectedItem]);

  useEffect(() => {
    if (selectedItemId) {
      const item = items.find(i => i.id === selectedItemId);
      setSelectedItem(item);
    } else {
      setSelectedItem(null);
    }
  }, [selectedItemId, items]);

  useEffect(() => {
    // Update stock entries array based on quantity
    const newEntries = [];
    for (let i = 0; i < quantity; i++) {
      newEntries.push(stockEntries[i] || { serial_number: '', asset_id: '' });
    }
    setStockEntries(newEntries);
  }, [quantity]);

  const handleItemChange = (e) => {
    setSelectedItemId(e.target.value);
  };

  const handleQuantityChange = (e) => {
    const qty = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, qty));
  };

  const handleStockEntryChange = (index, field, value) => {
    const newEntries = [...stockEntries];
    newEntries[index] = {
      ...newEntries[index],
      [field]: value
    };
    setStockEntries(newEntries);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedItemId) {
      alert('Please select an item');
      return;
    }
    onSubmit({
      item_id: selectedItemId,
      location,
      entries: stockEntries,
      admin_id: currentUser?.id,
      admin_name: currentUser?.name
    });
  };

  return (
    <div className="form-overlay">
      <div className="form-container stock-form-container">
        <div className="form-header">
          <h2>Update Stock</h2>
          <button className="btn-close" onClick={onCancel}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="inventory-form">
          <div className="form-group">
            <label htmlFor="item">Item Name *</label>
            <select
              id="item"
              value={selectedItemId}
              onChange={handleItemChange}
              required
              disabled={!!preSelectedItem}
              className={preSelectedItem ? 'disabled-input' : ''}
            >
              <option value="">Select an item...</option>
              {items.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {selectedItem && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    value={selectedItem.category}
                    disabled
                    className="disabled-input"
                  />
                </div>
                <div className="form-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    value={selectedItem.brand}
                    disabled
                    className="disabled-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Model</label>
                <input
                  type="text"
                  value={selectedItem.model}
                  disabled
                  className="disabled-input"
                />
              </div>
            </>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="e.g., Warehouse A, Office 101"
              />
            </div>
          </div>

          <div className="stock-entries-section">
            <label className="section-label">Serial Number & Asset ID *</label>
            <div className="stock-entries-list">
              {stockEntries.map((entry, index) => (
                <div key={index} className="stock-entry-row">
                  <div className="entry-number">#{index + 1}</div>
                  <div className="form-group">
                    <label>Serial Number</label>
                    <input
                      type="text"
                      value={entry.serial_number}
                      onChange={(e) => handleStockEntryChange(index, 'serial_number', e.target.value)}
                      required
                      placeholder="Enter serial number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Asset ID</label>
                    <input
                      type="text"
                      value={entry.asset_id}
                      onChange={(e) => handleStockEntryChange(index, 'asset_id', e.target.value)}
                      required
                      placeholder="Enter asset ID"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              Add Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStockForm;
