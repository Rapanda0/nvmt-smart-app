import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';
import { useNavigate } from 'react-router-dom';
import BASE_URL from './api';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'; 
import userRoleCheck from '../utils/authUtils';
import './global.css';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null); 
    const [editingUser, setEditingUser] = useState(null);
    const navigate = useNavigate();

    const [sortField, setSortField] = useState('id'); 
    const [sortOrder, setSortOrder] = useState('asc');

    const isAdmin = userRoleCheck();

    useEffect(() => {
        if (isAdmin) {
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${BASE_URL}/users/${userToDelete.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            fetchData();
            setShowConfirmDialog(false);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEditUser = (user) => {
        console.log('Editing user:', user)
        setEditingUser({ ...user }); 
    };

    const saveEditedUser = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${BASE_URL}/users/${editingUser.id}`, editingUser, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setEditingUser(null);
            fetchData();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const cancelEditUser = () => {
        setEditingUser(null); 
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingUser({ ...editingUser, [name]: value }); 
    };

    const showDeleteConfirmation = (user) => {

        setUserToDelete(user);
        setShowConfirmDialog(true);
    };

    const handleSort = (field) => {
        if (field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const sortedUsers = [...users].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a[sortField] > b[sortField] ? 1 : -1;
        } else {
            return a[sortField] < b[sortField] ? 1 : -1;
        }
    });

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
        <div>
            <button onClick={() => navigate('/dashboard') }>Back</button>
            <h2>User List (Admin Only)</h2>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('id')}>
                            ID
                            {sortField === 'id' && (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />)}
                        </th>
                        <th onClick={() => handleSort('username')}>
                            Username
                            {sortField === 'username' && (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />)}
                        </th>
                        <th onClick={() => handleSort('role_name')}>
                            Role
                            {sortField === 'role_name' && (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />)}
                        </th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedUsers.map(user => (
                        <tr key={user.id}>
                            <td>{editingUser && editingUser.id === user.id ? (
                                <input
                                    type="text"
                                    name="id"
                                    value={editingUser.id}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                user.id
                            )}</td>
                            <td>{editingUser && editingUser.id === user.id ? (
                                <input
                                    type="text"
                                    name="username"
                                    value={editingUser.username}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                user.username
                            )}</td>
                            <td>{editingUser && editingUser.id === user.id ? (
                                <select
                                    name="role_id"
                                    value={editingUser.role_id || ''}
                                    onChange={handleInputChange}
                                >
                                    <option value="" disabled hidden>Select Role</option>
                                    <option value="1">Admin</option>
                                    <option value="2">Manager</option>
                                    <option value="3">No Role</option>
                                </select>
                            ) : (
                                user.role_name || 'No Role'
                            )}</td>
                            <td>
                                {editingUser && editingUser.id === user.id ? (
                                    <>
                                        <button onClick={saveEditedUser}>Save</button>
                                        <button onClick={cancelEditUser}>Cancel</button>
                                    </>
                                ) : (
                                    <button onClick={() => handleEditUser(user)}>Edit</button>
                                )}
                                <button onClick={() => showDeleteConfirmation(user)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="confirmation-dialog">
                    <div className="confirmation-content">
                        <p>Are you sure you want to delete the following user?</p>
                        <p><strong>ID:</strong> {userToDelete.id}</p>
                        <p><strong>Username:</strong> {userToDelete.username}</p>
                        <div className="confirmation-buttons">
                            <button onClick={handleDeleteUser}>Confirm</button>
                            <button onClick={() => setShowConfirmDialog(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
