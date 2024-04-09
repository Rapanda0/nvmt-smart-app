import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css'; 
import logo from '../assets/logo.jpg'; 
import BASE_URL from './api';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         // Attempt to log in
    //         const response = await axios.post(`${BASE_URL}/login`, {
    //             username,
    //             password
    //         });

            
    //         console.log(response.data);

        
        
            
    //         navigate('/dashboard');
    //     } catch (error) {
    //         console.error(error);
            
           
    //     }
    // };

    // using local backend and testing token handling
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Attempt to log in
            const response = await axios.post(`http://localhost:3000/login`, {
                username,
                password
            });

            // Extract token from response
            const { accessToken, role_id } = response.data;

            // Store token in localStorage
            localStorage.setItem('token', accessToken);
            localStorage.setItem('role_id', role_id);

            // Navigate to dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            // Handle login failure (e.g., display error message)
        }
    };

    return (
        <div className="loginContainer">
            <img src={logo} alt="Logo" className="loginLogo" />
            <h2 className="loginTitle">Login</h2>
            <form onSubmit={handleSubmit} className="loginForm">
                <input
                    className="loginInput"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="loginInput"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="loginButton">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
