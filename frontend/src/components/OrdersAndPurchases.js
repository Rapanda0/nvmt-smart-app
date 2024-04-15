import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrdersAndPurchases.css'; 
import BASE_URL from './api';
import './global.css';

const OrdersAndPurchases = () => {

    document.title = "Orders";
    
    const [orders, setOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newOrder, setNewOrder] = useState({
        order_date: '',
        total_amount: '',
        supplier_id: '',
        is_purchase_order: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [orderResponse, supplierResponse] = await Promise.all([
                    axios.get(`${BASE_URL}/inventory/orders`),
                    axios.get(`${BASE_URL}/inventory/suppliers`)
                ]);
                setOrders(orderResponse.data);
                setSuppliers(supplierResponse.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleNewOrderChange = (e) => {
        const { name, value } = e.target;
        setNewOrder({ ...newOrder, [name]: value });
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/inventory/orders`, newOrder);
            setOrders([...orders, response.data]);
            setNewOrder({ order_date: '', total_amount: '', supplier_id: '', is_purchase_order: false });
        } catch (error) {
            console.error("Error submitting new order:", error);
        }
    };

    if (loading) {
        return (
            <div className= "loadingText">
                Loading...
                <div className="center">
                    {[...Array(10)].map((_, index) => (
                        <div key={index} className="wave"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="ordersPageContainer">
            <button onClick={() => window.history.back()} className= "backButton">Back</button> {/* Use history.goBack() if using React Router */}
            <h2>Orders & Purchases</h2>
            <div className="orderFormContainer">
                <h3>Add New Order</h3>
                <form onSubmit={handleSubmitOrder}>
                    <input 
                        type="date" 
                        name="order_date" 
                        value={newOrder.order_date}
                        onChange={handleNewOrderChange} 
                        required
                    />
                    <input 
                        type="number" 
                        name="total_amount" 
                        placeholder="Total Amount" 
                        value={newOrder.total_amount}
                        onChange={handleNewOrderChange} 
                        required
                    />
                    <select 
                        name="supplier_id" 
                        value={newOrder.supplier_id}
                        onChange={handleNewOrderChange} 
                        required
                    >
                        <option value="">Select Supplier</option>
                        {suppliers.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                        ))}
                    </select>
                    <button type="submit" className= "addOrderButton">Add Order</button>
                </form>
            </div>
            <div className="ordersListContainer">
                <h3>Existing Orders</h3>
                {orders.length > 0 ? (
                    <ul>
                        {orders.map(order => (
                            <li key={order.id}>Order ID: {order.id} - Date: {order.order_date || 'N/A'} - Total: ${order.total_amount} - Supplier: {suppliers.find(supplier => supplier.id === order.supplier_id)?.name || 'Unknown'}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No existing orders...</p>
                )}
            </div>
        </div>
    );
};

export default OrdersAndPurchases;
