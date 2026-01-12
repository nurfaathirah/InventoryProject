import React from 'react';
import './SearchBar.css';

const ItemNameFilter = ({ items, selectedItemId, onItemChange }) => {
  return (
    <div className="search-bar">
      <select
        value={selectedItemId}
        onChange={(e) => onItemChange(e.target.value)}
        className="category-filter"
      >
        <option value="">All Items</option>
        {items.map(item => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ItemNameFilter;
