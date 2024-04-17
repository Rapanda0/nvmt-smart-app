import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrdersAndPurchases.css';
import BASE_URL from './api';

function OrderAndPurchase() {
  const [order, setOrder] = useState({
    orderNo: '',
    date: '',
    supplier: '',
    items: [{ name: '', quantity: 0 }],
    total: 0,
  });
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]); // State to store suppliers
  const [loading, setLoading] = useState(true);

  // Fetch suppliers from your backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/suppliers`);
        setSuppliers(response.data);
      } catch (error) {
        console.error('Error fetching suppliers: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleItemChange = (index, event) => {
    const newItems = [...order.items];
    newItems[index][event.target.name] = event.target.value;
    setOrder({ ...order, items: newItems });
  };

  const addItem = () => {
    setOrder({
      ...order,
      items: [...order.items, { name: '', quantity: 0 }],
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setOrder({ ...order, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const total = order.items.reduce((acc, item) => acc + Number(item.quantity), 0) * 10; // Example calculation
    const newOrder = { ...order, total };
    setOrders([...orders, newOrder]);
    setOrder({
      orderNo: '',
      date: '',
      supplier: '',
      items: [{ name: '', quantity: 0 }],
      total: 0,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Create Order</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="orderNo"
          placeholder="Order No"
          value={order.orderNo}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="date"
          value={order.date}
          onChange={handleInputChange}
        />
        <select
          name="supplier"
          value={order.supplier}
          onChange={handleInputChange}
        >
          <option value="">Select a Supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.name}>
              {supplier.name}
            </option>
          ))}
        </select>
        {order.items.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              name="name"
              placeholder="Item Name"
              value={item.name}
              onChange={(event) => handleItemChange(index, event)}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(event) => handleItemChange(index, event)}
            />
          </div>
        ))}
        <button type="button" onClick={addItem}>Add Item</button>
        <button type="submit">Submit Order</button>
      </form>

      <h2>Orders</h2>
      <ul>
        {orders.map((order, index) => (
          <li key={index}>
            Order No: {order.orderNo}, Date: {order.date}, Supplier: {order.supplier}, Total: ${order.total}
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>{item.name} - Quantity: {item.quantity}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderAndPurchase;
