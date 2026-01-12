import React, { useState, useEffect } from 'react';
import StatsCard from '../components/StatsCard';
import DashboardInventoryList from '../components/DashboardInventoryList';
import { getInventory, getStats, getStock } from '../services/storage';

const Dashboard = ({ onNavigate, searchTerm: externalSearchTerm = '', categoryFilter: externalCategoryFilter = '' }) => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [stats, setStats] = useState({ totalItems: 0, pcs: 0, laptops: 0, totalQuantity: 0, locationCounts: {} });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterInventory();
  }, [inventory, externalSearchTerm, externalCategoryFilter]);

  const loadData = async () => {
    const inv = await getInventory();
    setInventory(inv || []);
    const statsData = await getStats();
    const stock = await getStock();

    // Calculate stock count by location
    const locationCounts = {};
    (stock || []).forEach(entry => {
      const location = entry.location || 'Unknown';
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    setStats({
      ...(statsData || { totalItems: 0, pcs: 0, laptops: 0, totalQuantity: 0 }),
      locationCounts
    });
  };

  const filterInventory = () => {
    let filtered = [...inventory];

    if (externalSearchTerm) {
      const term = externalSearchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.brand.toLowerCase().includes(term) ||
        item.model.toLowerCase().includes(term) ||
        (item.stock && item.stock.some(s => 
          (s.serial_number && s.serial_number.toLowerCase().includes(term)) ||
          (s.asset_id && s.asset_id.toLowerCase().includes(term))
        ))
      );
    }

    if (externalCategoryFilter) {
      filtered = filtered.filter(item => item.category === externalCategoryFilter);
    }

    setFilteredInventory(filtered);
  };

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Track and manage your computer inventory</p>
      </header>

      <StatsCard stats={stats} />

      {Object.keys(stats.locationCounts).length > 0 && (
        <div className="location-stats">
          <h2 className="location-stats-title">Stock by Location</h2>
          <div className="location-stats-grid">
            {Object.entries(stats.locationCounts).map(([location, count]) => (
              <div key={location} className="location-stat-card">
                <div className="location-stat-value">{count}</div>
                <div className="location-stat-label">📍 {location}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <DashboardInventoryList inventory={filteredInventory} />
    </div>
  );
};

export default Dashboard;
