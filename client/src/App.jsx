import React, { useState } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import StockIn from './pages/StockIn';
import StockOut from './pages/StockOut';
import Report from './pages/Report';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { getInventory, getStockOut, setCurrentUser, getCurrentUser } from './services/storage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [navigationData, setNavigationData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const handleNavigate = (page, data = null) => {
    setCurrentPage(page);
    setNavigationData(data);
    // Clear navigation data when switching pages (except when navigating to stock-in with data)
    if (page !== 'stock-in') {
      setTimeout(() => setNavigationData(null), 100);
    }
  };

  const handleSearch = async (term, category) => {
    setSearchTerm(term);
    setCategoryFilter(category);

    // Find where the item is located
    const inventory = await getInventory();
    const stockOut = await getStockOut();

    // Check if search term matches any item in inventory
    const termLower = term.toLowerCase();
    const foundInInventory = (inventory || []).some(item => {
      const matchesItem = (item.name || '').toLowerCase().includes(termLower) ||
        (item.brand || '').toLowerCase().includes(termLower) ||
        (item.model || '').toLowerCase().includes(termLower);
      const matchesStock = item.stock && item.stock.some(s => 
        ((s.serial_number || '')).toLowerCase().includes(termLower) ||
        ((s.asset_id || '')).toLowerCase().includes(termLower)
      );
      return matchesItem || matchesStock;
    });

    // Check if search term matches any item in stock out
    const foundInStockOut = (stockOut || []).some(entry => {
      return ((entry.item_name || '').toLowerCase().includes(termLower)) ||
        ((entry.serial_number || '').toLowerCase().includes(termLower)) ||
        ((entry.asset_id || '').toLowerCase().includes(termLower)) ||
        ((entry.staff_id || '').toLowerCase().includes(termLower));
    });

    // Navigate to appropriate page
    if (foundInStockOut) {
      setCurrentPage('stock-out-list');
    } else if (foundInInventory) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('dashboard'); // Default to dashboard
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} searchTerm={searchTerm} categoryFilter={categoryFilter} />;
      case 'stock-in':
        if (!getCurrentUser()) return <Login onNavigate={handleNavigate} />;
        // Check if navigationData is an edit object or a preselected item
        const isEditData = navigationData && navigationData.editStock;
        return (
          <StockIn 
            preSelectedItem={isEditData ? null : navigationData} 
            editData={isEditData ? navigationData : null} 
          />
        );
      case 'stock-out':
        if (!getCurrentUser()) return <Login onNavigate={handleNavigate} />;
        return <StockOut onNavigate={handleNavigate} />;
      case 'stock-out-list':
        if (!getCurrentUser()) return <Login onNavigate={handleNavigate} />;
        return <StockOut onNavigate={handleNavigate} showList={true} />;
      case 'report':
        if (!getCurrentUser()) return <Login onNavigate={handleNavigate} />;
        return <Report />;
      case 'login':
        return <Login onNavigate={handleNavigate} onLogin={(userData) => {
          const userName = userData.email ? userData.email.split('@')[0] : 'User';
          setCurrentUser({ name: userName });
          handleNavigate('dashboard');
        }} />;
      case 'signup':
        return <SignUp onNavigate={handleNavigate} onSignUp={(userData) => {
          setCurrentUser({ name: userData.name || 'User' });
          handleNavigate('dashboard');
        }} />;
      default:
        return <Dashboard onNavigate={handleNavigate} searchTerm={searchTerm} categoryFilter={categoryFilter} />;
    }
  };

  return (
    <div className="app">
      {currentPage !== 'login' && currentPage !== 'signup' && (
        <Navigation 
          currentPage={currentPage} 
          onNavigate={handleNavigate}
          onSearch={handleSearch}
        />
      )}
      {renderPage()}
    </div>
  );
}

export default App;
