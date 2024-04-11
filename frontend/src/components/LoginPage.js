import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css'; 
import logo from '../assets/logo-transparent-png.png'; 

const LoginPage = () => {
    document.title = 'Login';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUsernameError(''); // Clear previous errors
        setPasswordError(''); // Clear previous errors

        if (!username && !password) {
            setUsernameError('Please enter username');
            setPasswordError('Please enter password');
            return;
        } else if (!username) {
            setUsernameError('Please enter username');
            return;
        } else if (!password) {
            setPasswordError('Please enter password');
            return;
        }

        try {
            // Attempt to log in
            const response = await axios.post('http://localhost:3000/login', {
                username,
                password
            });

            // Extract token from response
            const { accessToken, role_id } = response.data;

            // Store token in localStorage
            localStorage.setItem('token', accessToken);
            localStorage.setItem('role_id', role_id);

            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            // Handle login failure (e.g., display error message)
        }
    };

    return (
        <div className="loginPageContainer">
            <a href="/" className="logoLink">
                <img src={logo} alt="Logo" className="smallLogo" />
            </a>
            <div className="loginContainer">
                <img src={logo} alt="Logo" className="loginLogo" />
                <h2 className="loginTitle">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="loginForm">
                    <input
                        className={`loginUsernameInput ${usernameError && 'error'}`}
                        type="Username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {usernameError && <div className="errorMessage">{usernameError}</div>}
                    <input
                        className={`loginPasswordInput ${passwordError && 'error'}`}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError && <div className="errorMessage">{passwordError}</div>}
                    <button type="submit" className="loginButton">Login</button>
                </form>

                <div className="signupText">
                    <p>Don't have an account?</p>
                    <button onClick={() => navigate('/signup')} className="signButton">Sign up</button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

