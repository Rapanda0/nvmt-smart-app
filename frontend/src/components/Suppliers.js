import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Suppliers.css'; 
import { useNavigate } from 'react-router-dom';
import BASE_URL from './api';
import './global.css';

const Suppliers = () => {
    document.title = "Suppliers";
    const navigate = useNavigate(); 
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newSupplier, setNewSupplier] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            //if (!isAuthenticated()) {
            //    navigate('/login');
            //    return;
            //}
            const response = await axios.get(`${BASE_URL}/suppliers`);
            setSuppliers(response.data);
        } catch (error) {
            console.error("Failed to fetch suppliers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        fetchSuppliers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSupplier(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/suppliers`, newSupplier);
            setSuppliers(prevSuppliers => [...prevSuppliers, response.data]);
            setNewSupplier({ name: '', email: '', phone: '', address: '' }); 
        } catch (error) {
            console.error("Error adding new supplier:", error);
        }
    };


    // Loading screen 
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
        <div className="suppliersContainer">
            <button onClick={() => navigate('/dashboard')} className= "backButton">Back</button> {/* Use history.goBack() if using React Router */}
            <h2 className= "addSupplierHeader">Add New Supplier</h2>
            <form onSubmit={handleSubmit} className="supplierForm">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={newSupplier.name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newSupplier.email}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={newSupplier.phone}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={newSupplier.address}
                    onChange={handleInputChange}
                />
                <button type="submit">Add Supplier</button>
            </form>
            <h2 className= "existingSuppliersHeader">Existing Suppliers</h2>
            <div className="suppliersList">
                {suppliers.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map((supplier) => (
                                <tr key={supplier.id}>
                                    <td>{supplier.name}</td>
                                    <td>{supplier.email}</td>
                                    <td>{supplier.phone}</td>
                                    <td>{supplier.address}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No existing suppliers...</p>
                )}
            </div>
        </div>
    );
};

export default Suppliers;
