import React from 'react';
import { useNavigate } from 'react-router-dom';

const Forbidden = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <button onClick={() => navigate('/dashboard')}>Back</button>
      <h1>403 Forbidden</h1>
      <p>Sorry, you are not authorized to access this page.</p>
    </div>
  );
};

export default Forbidden;
