import React from 'react';
import './SearchBar.css';

const SearchBar = ({ searchTerm, categoryFilter, onSearchChange, onCategoryChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by name, brand, model, or serial number..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      <select
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="category-filter"
      >
        <option value="">All Categories</option>
        <option value="PC">PC</option>
        <option value="Laptop">Laptop</option>
      </select>
    </div>
  );
};

export default SearchBar;
