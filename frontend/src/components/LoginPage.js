import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css'; 
import logo from '../assets/logo.jpg'; 

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Attempt to log in
            const response = await axios.post('https://nvmt-smart-app.azurewebsites.net/login', {
                username,
                password
            });

            
            console.log(response.data);

        
        
            
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            
           
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
