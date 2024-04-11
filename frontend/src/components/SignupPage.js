import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
import logo from '../assets/logo-transparent-png.png'; 

const SignupPage = () => {

    document.title = 'Sign Up';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]); 
        setSuccessMessage(''); 

        try {
            await axios.post('http://localhost:3000/register', {
                username,
                password,
            });
            
            setSuccessMessage('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors([{ msg: "An unexpected error occurred." }]);
            }
        }
    };

    return (
        <div className="signupPageContainer">
            <a href="/" className="logoLink">
                <img src={logo} alt="Logo" className="smallLogo" />
            </a>
            <div className="signupContainer">
                <img src={logo} alt="Logo" className="loginLogo" />
                <h2 className="signupTitle">Sign Up</h2>
                {successMessage && <div className="successMessage">{successMessage}</div>}
                {errors.map((error, index) => (
                    <div key={index} className="errorMessage">
                        {error.msg}
                    </div>
                ))}
                <form onSubmit={handleSubmit} className="signupForm">
                    <input
                        className={`signupUsernameInput ${errors.length > 0 && 'error'}`}
                        type="Username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className={`signupPasswordInput ${errors.length > 0 && 'error'}`}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="signUpButton">Sign Up</button>
                </form>

                <div className="loginLink">
                    <p>Already have an account?</p>
                    <button onClick={() => navigate('/login')} className="loginLinkButton">Login</button>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
