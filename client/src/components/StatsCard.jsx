import React from 'react';
import './StatsCard.css';

const StatsCard = ({ stats }) => {
  return (
    <div className="stats-container">
      <div className="stat-card">
        <div className="stat-icon">📦</div>
        <div className="stat-info">
          <div className="stat-value">{stats.totalItems || 0}</div>
          <div className="stat-label">Total Items</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">🖥️</div>
        <div className="stat-info">
          <div className="stat-value">{stats.pcs || 0}</div>
          <div className="stat-label">PCs</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">💻</div>
        <div className="stat-info">
          <div className="stat-value">{stats.laptops || 0}</div>
          <div className="stat-label">Laptops</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">📊</div>
        <div className="stat-info">
          <div className="stat-value">{stats.totalQuantity || 0}</div>
          <div className="stat-label">Total Stock Units</div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
