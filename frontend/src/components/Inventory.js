import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Inventory.css';
import BASE_URL from './api';
import { useNavigate } from 'react-router-dom';


const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryError, setCategoryError] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const navigate = useNavigate();
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    price: '',
    categoryId: '',
    supplierId: '',
    threshold_quantity: '',
    unit_of_measurement: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login if token is missing
            navigate('/login');
            return;
        }

        const [inventoryResponse, categoryResponse, supplierResponse] = await Promise.all([
          // axios.get(`${BASE_URL}/inventory`),
          //testing local bcakend
          axios.get('http://localhost:3000/inventory'),
          axios.get(`${BASE_URL}/categories`),
          axios.get(`${BASE_URL}/suppliers`),
        ]);
        setInventoryItems(inventoryResponse.data);
        setCategories(categoryResponse.data);
        setSuppliers(supplierResponse.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/categories`, { name: newCategoryName });
      setCategories([...categories, response.data]);
      setNewCategoryName('');
      setCategoryError(''); 
    } catch (error) {
      console.error('Error adding new category: ', error);
      setCategoryError('Category already exists or another error occurred');
    }
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    const capitalizedItemName = newItem.name.charAt(0).toUpperCase() + newItem.name.slice(1);

    try {
      const response = await axios.post(`${BASE_URL}/inventory`, {
        ...newItem,
        name: capitalizedItemName,
        category_id: newItem.categoryId,
        supplier_id: newItem.supplierId,
      });

      const enrichedItem = {
        ...response.data,
        category_name: categories.find((cat) => cat.id.toString() === newItem.categoryId)?.name,
        supplier_name: suppliers.find((sup) => sup.id.toString() === newItem.supplierId)?.name,
      };

      setInventoryItems([...inventoryItems, enrichedItem]);
      setNewItem({
        name: '',
        quantity: '',
        price: '',
        categoryId: '',
        supplierId: '',
        threshold_quantity: '',
        unit_of_measurement: '',
      });
    } catch (error) {
      console.error('Error adding new item: ', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }


  return (
    <div className="inventoryPageContainer">
      <button onClick={() => window.history.back()}>Back</button>
      <div className="leftColumn">
        <div className="categoryCreation">
          <h3>Create New Category</h3>
          {categoryError && <div style={{ color: 'red' }}>{categoryError}</div>}
          <form onSubmit={handleCategorySubmit}>
            <label htmlFor="categoryName">Category Name:</label>
            <input
              id="categoryName"
              type="text"
              placeholder="Enter Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <button type="submit">Add Category</button>
          </form>
        </div>
        <div className="addItemSection">
          <h3>Add Inventory Item</h3>
          <form onSubmit={handleItemSubmit}>
            <label htmlFor="itemCategory">Category:</label>
            <select
              id="itemCategory"
              value={newItem.categoryId}
              onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <label htmlFor="itemSupplier">Supplier:</label>
            <select
              id="itemSupplier"
              value={newItem.supplierId}
              onChange={(e) => setNewItem({ ...newItem, supplierId: e.target.value })}
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
              ))}
            </select>
            <label htmlFor="itemName">Item Name:</label>
            <input
              id="itemName"
              type="text"
              placeholder="Enter Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <label htmlFor="itemQuantity">Quantity:</label>
            <input
              id="itemQuantity"
              type="number"
              placeholder="Enter Quantity"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value, 10) || '' })}
            />
            <label htmlFor="itemPrice">Price:</label>
            <input
              id="itemPrice"
              type="number"
              step="0.01"
              placeholder="Enter Price per Unit"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || '' })}
            />
            <label htmlFor="thresholdQuantity">Threshold Quantity:</label>
            <input
              id="thresholdQuantity"
              type="number"
              placeholder="Enter Threshold Quantity"
              value={newItem.threshold_quantity}
              onChange={(e) => setNewItem({ ...newItem, threshold_quantity: parseInt(e.target.value, 10) || '' })}
            />
            <label htmlFor="unitOfMeasurement">Unit of Measurement:</label>
            <input
              id="unitOfMeasurement"
              type="text"
              placeholder="e.g., kg, lbs, oz, grams"
              value={newItem.unit_of_measurement}
              onChange={(e) => setNewItem({ ...newItem, unit_of_measurement: e.target.value })}
            />
            <button type="submit">Add Item</button>
          </form>
        </div>
      </div>
      <div className="inventoryDisplay">
        <h3>Inventory on Hand</h3>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Unit of Measurement</th>
              <th>Price per Unit</th>
              <th>Threshold Quantity</th>
              <th>Total Value</th>
              <th>Supplier</th> {/* Add Supplier column */}
            </tr>
          </thead>
          <tbody>
          {inventoryItems.map((item) => (
            <tr key={item.id} style={item.quantity < item.threshold_quantity ? { color: 'red', fontWeight: 'bold' } : {}}>
              <td>{item.category_name}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.unit_of_measurement}</td>
              <td>${parseFloat(item.price).toFixed(2)}</td>
              <td>{item.threshold_quantity}</td>
              <td>${parseFloat(item.quantity * item.price).toFixed(2)}</td>
              <td>{item.supplier_name || 'N/A'}</td> {/* Display Supplier name, handle accordingly if supplier_name isn't provided */}
            </tr>  
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;

