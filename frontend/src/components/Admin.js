import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // USED TO RESTRICT ACCESS TO PAGES BASED ON ROLES AND IF AUTHENTICATED
                const token = localStorage.getItem('token');
                const userRole = localStorage.getItem('role_id');

                if (!token) {
                    // Redirect to login if token is missing
                    navigate('/login');
                    return;
                }
                if (userRole !== '1') {
                    navigate('/forbidden');
                    return;
                }

                const response = await axios.get('http://localhost:3000/users', {
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

        fetchData();
    }, [navigate]); 

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>User List (Admin Only)</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.role_name || 'No Role'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Admin;
