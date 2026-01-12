import React, { useState, useEffect } from 'react';
import AddItemForm from '../components/AddItemForm';
import UpdateStockForm from '../components/UpdateStockForm';
import EditStockForm from '../components/EditStockForm';
import InventoryList from '../components/InventoryList';
import { getInventory, getItems, addItem, addStockEntries, updateStockEntry, deleteStockEntry } from '../services/storage';

const StockIn = ({ preSelectedItem, editData }) => {
  const [inventory, setInventory] = useState([]);
  const [items, setItems] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showUpdateStockForm, setShowUpdateStockForm] = useState(false);
  const [preSelectedItemForStock, setPreSelectedItemForStock] = useState(null);
  const [showEditStockForm, setShowEditStockForm] = useState(false);
  const [editingStockEntry, setEditingStockEntry] = useState(null);
  const [editingStockItem, setEditingStockItem] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (preSelectedItem) {
      setPreSelectedItemForStock(preSelectedItem);
      setShowUpdateStockForm(true);
    }
  }, [preSelectedItem]);

  useEffect(() => {
    if (editData) {
      setEditingStockEntry(editData.editStock);
      setEditingStockItem(editData.item);
      setShowEditStockForm(true);
    }
  }, [editData]);

  const loadData = async () => {
    const inv = await getInventory();
    const itemsList = await getItems();
    setInventory(inv || []);
    setItems(itemsList || []);
    setFilteredInventory(inv || []);
  };

  const handleAddItem = () => {
    setShowAddItemForm(true);
  };

  const handleUpdateStock = (item = null) => {
    if (items.length === 0) {
      alert('Please add an item first before updating stock');
      return;
    }
    setPreSelectedItemForStock(item);
    setShowUpdateStockForm(true);
  };

  const handleAddItemSubmit = async (formData) => {
    try {
      await addItem(formData);
      setShowAddItemForm(false);
      await loadData();
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Error adding item');
    }
  };

  const handleUpdateStockSubmit = async (formData) => {
    try {
      await addStockEntries(formData.item_id, formData.entries.map(entry => ({
        serial_number: entry.serial_number,
        asset_id: entry.asset_id,
        location: formData.location
      })));
      setShowUpdateStockForm(false);
      setPreSelectedItemForStock(null);
      await loadData();
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Error updating stock');
    }
  };

  const handleUpdateStockCancel = () => {
    setShowUpdateStockForm(false);
    setPreSelectedItemForStock(null);
  };

  const handleEditStock = (stockEntry, item) => {
    setEditingStockEntry(stockEntry);
    setEditingStockItem(item);
    setShowEditStockForm(true);
  };

  const handleEditStockSubmit = async (formData) => {
    try {
      await updateStockEntry(editingStockEntry.id, formData);
      setShowEditStockForm(false);
      setEditingStockEntry(null);
      setEditingStockItem(null);
      await loadData();
    } catch (error) {
      console.error('Error updating stock entry:', error);
      const msg = (error && (error.response && error.response.error)) || error.message || 'Error updating stock entry';
      alert(msg);
    }
  };

  const handleEditStockCancel = () => {
    setShowEditStockForm(false);
    setEditingStockEntry(null);
    setEditingStockItem(null);
  };

  const handleDeleteStockEntry = async () => {
    try {
      await deleteStockEntry(editingStockEntry.id);
      setShowEditStockForm(false);
      setEditingStockEntry(null);
      setEditingStockItem(null);
      await loadData();
    } catch (error) {
      console.error('Error deleting stock entry:', error);
      const msg = (error && (error.response && error.response.error)) || error.message || 'Error deleting stock entry';
      alert(msg);
    }
  };

  return (
    <div className="stock-in-page">
      <header className="page-header">
        <h1>📦 Stock In</h1>
        <p>Add new items and update inventory stock</p>
      </header>

      <div className="controls">
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={handleAddItem}>
            + Add New Item
          </button>
        </div>
      </div>

      {showAddItemForm && (
        <AddItemForm
          onSubmit={handleAddItemSubmit}
          onCancel={() => setShowAddItemForm(false)}
        />
      )}

      {showUpdateStockForm && (
        <UpdateStockForm
          items={items}
          preSelectedItem={preSelectedItemForStock}
          onSubmit={handleUpdateStockSubmit}
          onCancel={handleUpdateStockCancel}
        />
      )}

      {showEditStockForm && editingStockEntry && editingStockItem && (
        <EditStockForm
          stockEntry={editingStockEntry}
          item={editingStockItem}
          onSubmit={handleEditStockSubmit}
          onCancel={handleEditStockCancel}
          onDelete={handleDeleteStockEntry}
        />
      )}

      <InventoryList
        inventory={filteredInventory}
        onUpdateStock={handleUpdateStock}
        onEditStock={handleEditStock}
      />
    </div>
  );
};

export default StockIn;
