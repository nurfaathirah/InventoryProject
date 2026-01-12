import React, { useState, useEffect } from 'react';
import ItemNameFilter from '../components/ItemNameFilter';
import { getInventory, getItems, updateStockEntry, addStockOutEntry, getStockOut } from '../services/storage';

const StockOut = ({ onNavigate, showList = false }) => {
  const [inventory, setInventory] = useState([]);
  const [items, setItems] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [stockEntriesData, setStockEntriesData] = useState({});
  const [stockOutList, setStockOutList] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (showList) {
      loadStockOutList();
    } else {
      filterInventory();
    }
  }, [inventory, selectedItemId, showList]);

  useEffect(() => {
    if (showList) {
      loadStockOutList();
    }
  }, [showList]);

  const loadData = async () => {
    const inv = await getInventory();
    const itemsList = await getItems();
    setInventory(inv || []);
    setItems(itemsList || []);

    // Initialize stock entries data
    const entriesData = {};
    (inv || []).forEach(item => {
      if (item.stock && item.stock.length > 0) {
        item.stock.forEach(stockEntry => {
          entriesData[stockEntry.id] = {
            staff_id: stockEntry.staff_id || '',
            deployment_location: stockEntry.deployment_location || '',
            deployment_date: stockEntry.deployment_date || ''
          };
        });
      }
    });
    setStockEntriesData(entriesData);
  };

  const loadStockOutList = async () => {
    const list = await getStockOut();
    setStockOutList(list || []);
  };

  const filterInventory = () => {
    let filtered = [...inventory];

    if (selectedItemId) {
      filtered = filtered.filter(item => item.id === selectedItemId);
    }

    setFilteredInventory(filtered);
  };

  const handleFieldChange = (stockEntryId, field, value) => {
    setStockEntriesData(prev => ({
      ...prev,
      [stockEntryId]: {
        ...prev[stockEntryId],
        [field]: value
      }
    }));
  };

  const handleSave = async (stockEntryId, item) => {
    const entryData = stockEntriesData[stockEntryId];
    if (!entryData) return;

    // Validate required fields
    if (!entryData.staff_id || !entryData.deployment_location || !entryData.deployment_date) {
      alert('Please fill in all fields: Staff ID, Deployment Location, and Deployment Date');
      return;
    }

    try {
      // Find the stock entry
      const stockEntry = (item.stock || []).find(s => s.id === stockEntryId);
      if (!stockEntry) {
        alert('Stock entry not found');
        return;
      }

      const payload = {
        serial_number: stockEntry.serial_number ?? null,
        asset_id: stockEntry.asset_id ?? null,
        location: stockEntry.location ?? null,
        staff_id: entryData.staff_id,
        deployment_location: entryData.deployment_location,
        deployment_date: entryData.deployment_date
      };
      console.debug('Updating stock entry', stockEntryId, payload);

      const updatedEntry = await updateStockEntry(stockEntryId, payload);

      console.debug('Creating stock-out for', stockEntryId, 'item', item.id);
      await addStockOutEntry(stockEntryId, item.id, payload);

      alert('Stock entry saved and moved to Stock Out list');
      await loadData();
    } catch (error) {
      console.error('Error saving stock entry:', error);
      const msg = (error && (error.response && error.response.error)) || error.message || 'Error saving stock entry';
      alert(msg);
    }
  };

  if (showList) {
    return (
      <div className="stock-out-page">
        <header className="page-header">
          <h1>📋 Stock Out List</h1>
          <p>View all deployed stock entries</p>
        </header>
        <div className="controls">
          <button className="btn btn-secondary" onClick={() => onNavigate('stock-out')}>
            ← Back to Stock Out
          </button>
        </div>
        {stockOutList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h2>No stock out entries found</h2>
            <p>No items have been deployed yet</p>
          </div>
        ) : (
          <div className="stock-out-list-container">
            <table className="stock-table stock-out-list-table" style={{ width: '100%' }}>
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
                {stockOutList.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.item_name || 'N/A'}</td>
                    <td>{entry.item_category || 'N/A'}</td>
                    <td>{entry.item_brand || 'N/A'}</td>
                    <td>{entry.item_model || 'N/A'}</td>
                    <td>{entry.serial_number || 'N/A'}</td>
                    <td>{entry.asset_id || 'N/A'}</td>
                    <td>📍 {entry.location || 'N/A'}</td>
                    <td>{entry.staff_id || 'N/A'}</td>
                    <td>{entry.deployment_location || 'N/A'}</td>
                    <td>{entry.deployment_date ? new Date(entry.deployment_date).toLocaleDateString() : 'N/A'}</td>
                    <td>{entry.stock_out_date ? new Date(entry.stock_out_date).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  if (inventory.length === 0) {
    return (
      <div className="stock-out-page">
        <header className="page-header">
          <h1>📤 Stock Out</h1>
          <p>Manage stock deployment information</p>
        </header>
        <div className="controls">
          <button className="btn btn-primary" onClick={() => onNavigate('stock-out-list')}>
            📋 Stock Out List
          </button>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h2>No items found</h2>
          <p>No stock available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-out-page">
      <header className="page-header">
        <h1>📤 Stock Out</h1>
        <p>Manage stock deployment information</p>
      </header>

      <div className="controls">
        <ItemNameFilter
          items={items}
          selectedItemId={selectedItemId}
          onItemChange={setSelectedItemId}
        />
        <button className="btn btn-primary" onClick={() => onNavigate('stock-out-list')}>
          📋 Stock Out List
        </button>
      </div>

      <div className="inventory-list stock-out-list">
        {filteredInventory.map((item) => (
          <div key={item.id} className="inventory-card stock-out-card">
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

              {item.stock && item.stock.length > 0 && (
                <div className="stock-out-table-container">
                  <table className="stock-table stock-out-table">
                    <thead>
                      <tr>
                        <th>Serial Number</th>
                        <th>Asset ID</th>
                        <th>Location</th>
                        <th>Staff ID</th>
                        <th>Deployment Location</th>
                        <th>Deployment Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.stock.map((stockEntry) => {
                        const entryData = stockEntriesData[stockEntry.id] || {
                          staff_id: stockEntry.staff_id || '',
                          deployment_location: stockEntry.deployment_location || '',
                          deployment_date: stockEntry.deployment_date || ''
                        };
                        return (
                          <tr key={stockEntry.id}>
                            <td>{stockEntry.serial_number || 'N/A'}</td>
                            <td>{stockEntry.asset_id || 'N/A'}</td>
                            <td>📍 {stockEntry.location || 'N/A'}</td>
                            <td>
                              <input
                                type="text"
                                value={entryData.staff_id}
                                onChange={(e) => handleFieldChange(stockEntry.id, 'staff_id', e.target.value)}
                                placeholder="Enter staff ID"
                                className="stock-out-input"
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={entryData.deployment_location}
                                onChange={(e) => handleFieldChange(stockEntry.id, 'deployment_location', e.target.value)}
                                placeholder="Enter deployment location"
                                className="stock-out-input"
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                value={entryData.deployment_date}
                                onChange={(e) => handleFieldChange(stockEntry.id, 'deployment_date', e.target.value)}
                                className="stock-out-input"
                              />
                            </td>
                            <td>
                              <button
                                className="btn btn-success"
                                onClick={() => handleSave(stockEntry.id, item)}
                                title="Save Changes"
                              >
                                💾 Save
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockOut;
