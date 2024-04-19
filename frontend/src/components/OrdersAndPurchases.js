import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrdersAndPurchases.css';
import BASE_URL from './api';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/authUtils';

function OrderAndPurchase() {
  const [order, setOrder] = useState({
    orderNo: '',
    date: '',
    supplier: '',
    items: [{ name: '', quantity: 0 }],
    total: 0,
  });
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      if (!isAuthenticated()) {
        navigate('/login');
        return;
     }

      const response = await axios.get(`${BASE_URL}/suppliers`);
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers: ', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
 
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
    const total = order.items.reduce((acc, item) => acc + Number(item.quantity), 0) * 10;
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
    <div className="orderAndPurchaseContainer">
      <h2>Create Order</h2>
      <form onSubmit={handleSubmit} className="orderForm">
        <input
          type="text"
          name="orderNo"
          placeholder="Order No"
          value={order.orderNo}
          onChange={handleInputChange}
          className="orderInput"
        />
        <input
          type="date"
          name="date"
          value={order.date}
          onChange={handleInputChange}
          className="orderInput"
        />
        <select
          name="supplier"
          value={order.supplier}
          onChange={handleInputChange}
          className="orderInput"
        >
          <option value="">Select a Supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.name}>
              {supplier.name}
            </option>
          ))}
        </select>
        {order.items.map((item, index) => (
          <div key={index} className="orderItem">
            <input
              type="text"
              name="name"
              placeholder="Item Name"
              value={item.name}
              onChange={(event) => handleItemChange(index, event)}
              className="orderInput"
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(event) => handleItemChange(index, event)}
              className="orderInput"
            />
          </div>
        ))}
        <button type="button" onClick={addItem} className="orderButton">
          Add Item
        </button>
        <button type="submit" className="orderButton">
          Submit Order
        </button>
      </form>

      <h2>Orders</h2>
      <ul className="orderList">
        {orders.map((order, index) => (
          <li key={index} className="orderListItem">
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
