import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory'; 
import Suppliers from './components/Suppliers'; 
import OrdersAndPurchases from './components/OrdersAndPurchases'; 
import Admin from './components/Admin';
import Forbidden from './components/Forbidden';

function App() {

  //UNCOMMENTED WHEN FINISHED TESTING
  // const userRole = localStorage.getItem('role_id');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/orders" element={<OrdersAndPurchases />} />
        <Route path="/forbidden" element={<Forbidden />} />
        {/* {userRole === '1' ? (
          <Route path="/admin" element={<Admin />} />
        ) : (
          <Route path="/admin" element={<Navigate to="/forbidden" />} />
        )} */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
