// src/components/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  document.title = 'Home';
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <body>
    <div className="contentContainer">
      <div className="leftSide">
        <h1 className="animatedText">Welcome to NVMT</h1>
        {/* Add the logo image here */}
        <img src="frontend\src\assets\logo-transparent-png.png" alt="Logo" className="logoImage" />
      </div>
      <div className="rightSide">
        <h2 className="getStartedTitle">Get Started</h2>
        <div className="buttonContainer">
          <button className="homeLoginButton" onClick={handleLoginClick}>Log in</button>
          <button className="homeSignupButton" onClick={handleSignupClick}>Sign Up</button>
        </div>
      </div>
    </div>
    </body>
  );
};

export default HomePage;
