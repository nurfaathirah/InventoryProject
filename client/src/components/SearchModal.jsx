import React, { useState } from 'react';
import './SearchModal.css';

const SearchModal = ({ isOpen, onClose, onSearch, searchTerm: initialSearchTerm = '', categoryFilter: initialCategoryFilter = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter);

  if (!isOpen) return null;

  const handleSearch = () => {
    onSearch(searchTerm, categoryFilter);
    onClose();
  };

  const handleClear = () => {
    setSearchTerm('');
    setCategoryFilter('');
    onSearch('', '');
    onClose();
  };

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
              placeholder="Search by name, brand, model, or serial number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-modal-input"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
        </div>
        <div className="search-modal-footer">
          <button className="btn btn-secondary" onClick={handleClear}>
            Clear
          </button>
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
