// src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; 

const HomePage = () => {
  return (
    <div className="homePageContainer">
      <h1 className="homePageTitle">Welcome to NVMT</h1>
      <div className="homePageButtons">
        <Link to="/signup" className="buttonLink"><button className="button">Sign Up</button></Link>
        <Link to="/login" className="buttonLink"><button className="button">Login</button></Link>
      </div>
    </div>
  );
};

export default HomePage;
