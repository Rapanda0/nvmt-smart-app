import React from 'react';

const LogoutButton = () => {
  const handleLogout = () => {
    // clearing token and role from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    window.location.href = '/login'; // Redirect using JavaScript
  };

  return (
    <button onClick={handleLogout}className= "logoutButton">Logout</button>
  );
};

export default LogoutButton;
