import React, { useState, useEffect } from 'react';
import './SearchModal.css';
import { getInventory, getStockOut } from '../services/storage';

const SearchModal = ({ isOpen, onClose, onSearch, onNavigate, searchTerm: initialSearchTerm = '', categoryFilter: initialCategoryFilter = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemDetails, setShowItemDetails] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() && isOpen) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, categoryFilter, isOpen]);

  const performSearch = async () => {
    const inventory = await getInventory();
    const stockOut = await getStockOut();
    const term = searchTerm.toLowerCase();
    const results = [];

    // Search in inventory
    if (inventory && inventory.length > 0) {
      inventory.forEach(item => {
        const matchesSearch = 
          item.name.toLowerCase().includes(term) ||
          item.brand.toLowerCase().includes(term) ||
          item.model.toLowerCase().includes(term) ||
          (item.stock && item.stock.some(s => 
            (s.serial_number && s.serial_number.toLowerCase().includes(term)) ||
            (s.asset_id && s.asset_id.toLowerCase().includes(term))
          ));
        
        const matchesCategory = !categoryFilter || item.category === categoryFilter;

        if (matchesSearch && matchesCategory) {
          results.push({
            type: 'inventory',
            id: item.id,
            name: item.name,
            brand: item.brand,
            model: item.model,
            category: item.category,
            quantity: item.quantity,
            fullItem: item,
            highlight: item.model.toLowerCase().includes(term) ? 'model' : 'other'
          });
        }
      });
    }

    // Search in stock out
    if (stockOut && stockOut.length > 0) {
      stockOut.forEach(entry => {
        const matchesSearch = 
          (entry.item_name && entry.item_name.toLowerCase().includes(term)) ||
          (entry.serial_number && entry.serial_number.toLowerCase().includes(term)) ||
          (entry.asset_id && entry.asset_id.toLowerCase().includes(term)) ||
          (entry.staff_id && entry.staff_id.toLowerCase().includes(term));

        if (matchesSearch) {
          results.push({
            type: 'stockout',
            id: entry.id,
            name: entry.item_name,
            serialNumber: entry.serial_number,
            assetId: entry.asset_id,
            staffId: entry.staff_id,
            adminName: entry.admin_name,
            deploymentLocation: entry.deployment_location,
            fullEntry: entry,
            highlight: entry.item_name && entry.item_name.toLowerCase().includes(term) ? 'name' : 'other'
          });
        }
      });
    }

    setSearchResults(results);
  };

  const handleItemClick = (result) => {
    setSelectedItem(result);
    setShowItemDetails(true);
  };

  const handleSearch = () => {
    // If searching for an inventory item with asset ID or serial number, navigate to stock-in with that item
    if (searchResults.length === 1 && searchResults[0].type === 'inventory' && searchResults[0].fullItem) {
      const isAssetOrSerialSearch = searchTerm.toLowerCase().trim() && 
        (searchResults[0].fullItem.stock && searchResults[0].fullItem.stock.some(s => 
          (s.serial_number && s.serial_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (s.asset_id && s.asset_id.toLowerCase().includes(searchTerm.toLowerCase()))
        ));
      
      if (isAssetOrSerialSearch && onNavigate) {
        // Navigate to stock-in and pass item for expanded view
        onNavigate('stock-in', { 
          expandedItemId: searchResults[0].fullItem.id,
          highlightedAssetOrSerial: searchTerm
        });
        onClose();
        return;
      }
    }
    
    // Default behavior - search across all pages
    onSearch(searchTerm, categoryFilter);
    onClose();
  };

  const handleClear = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setSearchResults([]);
    onSearch('', '');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <h2>🔍 Search Inventory</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <div className="search-modal-body">
          <div className="search-modal-input-group">
            <label htmlFor="search-input">Search Term</label>
            <input
              id="search-input"
              type="text"
              placeholder="Search by name, brand, model, serial number, asset ID, or staff ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-modal-input"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              autoFocus
            />
          </div>
          <div className="search-modal-input-group">
            <label htmlFor="category-filter">Category</label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="search-modal-select"
            >
              <option value="">All Categories</option>
              <option value="PC">PC</option>
              <option value="Laptop">Laptop</option>
            </select>
          </div>

          {searchTerm.trim() && (
            <div className="search-results">
              <h3>Results ({searchResults.length})</h3>
              {searchResults.length === 0 ? (
                <p className="no-results">No items found matching your search.</p>
              ) : (
                <div className="results-list">
                  {searchResults.map((result, idx) => (
                    <div
                      key={`${result.type}-${result.id}-${idx}`}
                      className="result-item"
                      onClick={() => handleItemClick(result)}
                    >
                      <div className="result-type-badge">
                        {result.type === 'inventory' ? '📦 Stock' : '🚚 Stock Out'}
                      </div>
                      <div className="result-content">
                        {result.type === 'inventory' ? (
                          <>
                            <div className="result-title">{result.name}</div>
                            <div className="result-details">
                              <span className="result-brand">{result.brand}</span>
                              {result.highlight === 'model' && (
                                <span className="result-model highlight">🎯 {result.model}</span>
                              )}
                              <span className="result-category">{result.category}</span>
                              <span className="result-qty">Qty: {result.quantity}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="result-title">{result.name}</div>
                            <div className="result-details">
                              <span className="result-serial">Serial: {result.serialNumber}</span>
                              <span className="result-asset">Asset ID: {result.assetId}</span>
                              <span className="result-staff">Staff: {result.staffId}</span>
                              <span className="result-admin">👨‍💼 Admin: {result.adminName || 'N/A'}</span>
                              <span className="result-location">📍 {result.deploymentLocation}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="search-modal-footer">
          <button className="btn btn-secondary" onClick={handleClear}>
            Clear
          </button>
          <button className="btn btn-primary" onClick={handleSearch} disabled={!searchTerm.trim()}>
            Search All Pages
          </button>
        </div>
      </div>

      {showItemDetails && selectedItem && (
        <div className="item-details-modal-overlay" onClick={() => setShowItemDetails(false)}>
          <div className="item-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="item-details-header">
              <h2>Item Details</h2>
              <button className="btn-close" onClick={() => setShowItemDetails(false)}>×</button>
            </div>
            <div className="item-details-content">
              {selectedItem.type === 'inventory' && selectedItem.fullItem && (
                <>
                  <div className="detail-section">
                    <h3>Item Information</h3>
                    <div className="detail-row">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">{selectedItem.fullItem.name}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Brand:</span>
                      <span className="detail-value">{selectedItem.fullItem.brand}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Model:</span>
                      <span className="detail-value highlight">{selectedItem.fullItem.model}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Category:</span>
                      <span className="detail-value">{selectedItem.fullItem.category}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Quantity in Stock:</span>
                      <span className="detail-value"><strong>{selectedItem.fullItem.quantity}</strong></span>
                    </div>
                  </div>

                  {selectedItem.fullItem.stock && selectedItem.fullItem.stock.length > 0 && (
                    <div className="detail-section">
                      <h3>Stock Details ({selectedItem.fullItem.stock.length} units)</h3>
                      <table className="stock-details-table">
                        <thead>
                          <tr>
                            <th>Asset ID</th>
                            <th>Serial Number</th>
                            <th>Location</th>
                            <th>Admin Name</th>
                            <th>Date Restock</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedItem.fullItem.stock.map((stock, idx) => (
                            <tr key={idx}>
                              <td>{stock.asset_id || 'N/A'}</td>
                              <td>{stock.serial_number || 'N/A'}</td>
                              <td>{stock.location || 'N/A'}</td>
                              <td><strong>{stock.admin_name || 'N/A'}</strong></td>
                              <td>{stock.created_at ? new Date(stock.created_at).toLocaleDateString() : 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {selectedItem.type === 'stockout' && selectedItem.fullEntry && (
                <div className="detail-section">
                  <h3>Stock Out Deployment Details</h3>
                  <div className="detail-row">
                    <span className="detail-label">Item Name:</span>
                    <span className="detail-value">{selectedItem.fullEntry.item_name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Category:</span>
                    <span className="detail-value">{selectedItem.fullEntry.item_category}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Serial Number:</span>
                    <span className="detail-value">{selectedItem.fullEntry.serial_number}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Asset ID:</span>
                    <span className="detail-value">{selectedItem.fullEntry.asset_id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Staff ID:</span>
                    <span className="detail-value"><strong>{selectedItem.fullEntry.staff_id}</strong></span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Admin Name:</span>
                    <span className="detail-value"><strong>👨‍💼 {selectedItem.fullEntry.admin_name || 'N/A'}</strong></span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Deployment Location:</span>
                    <span className="detail-value">📍 {selectedItem.fullEntry.deployment_location}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Deployment Date:</span>
                    <span className="detail-value">{selectedItem.fullEntry.deployment_date ? new Date(selectedItem.fullEntry.deployment_date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Stock Out Date:</span>
                    <span className="detail-value">{selectedItem.fullEntry.stock_out_date ? new Date(selectedItem.fullEntry.stock_out_date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="item-details-footer">
              <button className="btn btn-secondary" onClick={() => setShowItemDetails(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchModal;
