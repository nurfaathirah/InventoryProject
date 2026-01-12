import * as api from './api';

const USER_KEY = 'current_user';

// Items
export const getItems = async () => {
  return await api.getItems();
};

export const addItem = async (item) => {
  return await api.addItem(item);
};

export const deleteItem = async (id) => {
  return await api.deleteItem(id);
};

// Stock
export const getStock = async () => {
  return await api.getStock();
};

export const addStockEntries = async (itemId, entries) => {
  return await api.addStockEntries(itemId, entries);
};

export const updateStockEntry = async (id, updatedEntry) => {
  return await api.updateStockEntry(id, updatedEntry);
};

export const deleteStockEntry = async (id) => {
  return await api.deleteStockEntry(id);
};

// Inventory combines items + stock on server
export const getInventory = async () => {
  return await api.getInventory();
};

// Stock out
export const getStockOut = async () => {
  return await api.getStockOut();
};

export const addStockOutEntry = async (stockId, itemId, deploymentData) => {
  return await api.addStockOutEntry(stockId, itemId, deploymentData);
};

// Stats
export const getStats = async () => {
  return await api.getStats();
};

// User management (client-side only)
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};

export const setCurrentUser = (user) => {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch (e) {}
};
