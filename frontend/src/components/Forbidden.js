import React from 'react';
import { useNavigate } from 'react-router-dom';
import './global.css';

const Forbidden = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <button onClick={() => navigate('/dashboard')}>Back</button>
      <h1>403 Forbidden</h1>
      <p>You are not authorized to view this page.</p>
    </div>
  );
};

export default Forbidden;
