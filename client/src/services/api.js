const API_BASE_URL = 'http://localhost:3001/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    // Parse JSON when possible
    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }

    if (!response.ok) {
      const msg = (data && data.error) || response.statusText || `HTTP ${response.status}`;
      const err = new Error(msg);
      err.status = response.status;
      err.response = data;
      throw err;
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Users API
export const registerUser = async (userData) => {
  return apiCall('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};

export const loginUser = async (credentials) => {
  return apiCall('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
};

export const getCurrentUser = async (userId) => {
  return apiCall(`/users/current?userId=${userId}`);
};

// Items API
export const getItems = async () => {
  const result = await apiCall('/items');
  return result.data || [];
};

export const addItem = async (item) => {
  const result = await apiCall('/items', {
    method: 'POST',
    body: JSON.stringify(item)
  });
  return result.data;
};

export const deleteItem = async (id) => {
  await apiCall(`/items/${id}`, {
    method: 'DELETE'
  });
};

// Stock API
export const getStock = async () => {
  const result = await apiCall('/stock');
  return result.data || [];
};

export const addStockEntries = async (itemId, entries) => {
  const result = await apiCall('/stock', {
    method: 'POST',
    body: JSON.stringify({ item_id: itemId, entries })
  });
  return result.data || [];
};

export const updateStockEntry = async (id, updatedEntry) => {
  const result = await apiCall(`/stock/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updatedEntry)
  });
  return result.data;
};

export const deleteStockEntry = async (id) => {
  await apiCall(`/stock/${id}`, {
    method: 'DELETE'
  });
};

// Inventory API
export const getInventory = async () => {
  const result = await apiCall('/inventory');
  return result.data || [];
};

// Stock Out API
export const getStockOut = async () => {
  const result = await apiCall('/stock-out');
  return result.data || [];
};

export const addStockOutEntry = async (stockId, itemId, deploymentData) => {
  const result = await apiCall('/stock-out', {
    method: 'POST',
    body: JSON.stringify({
      stock_id: stockId,
      item_id: itemId,
      ...deploymentData
    })
  });
  return result.data;
};

// Stats API
export const getStats = async () => {
  const result = await apiCall('/stats');
  return result.data || {};
};
