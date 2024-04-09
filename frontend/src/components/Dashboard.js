import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import LogoutButton from './LogoutButton';



import inventoryIcon from '../assets/inventory.png';
import ordersIcon from '../assets/oandp.png';
import suppliersIcon from '../assets/supplier.webp';

// Other imports and code

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboardContainer">
      <div className='logoutButton'>
      <LogoutButton />
      </div>
      <div className="flexBoxesContainer">
        <div className="flexBox" onClick={() => navigate('/inventory')}>
          <img src={inventoryIcon} alt="Inventory Icon" className="icon" />
          <p>INVENTORY</p>
        </div>
        <div className="flexBox" onClick={() => navigate('/suppliers')}>
          <img src={suppliersIcon} alt="Suppliers Icon" className="icon" />
          <p>Suppliers</p>
        </div>
        <div className="flexBox" onClick={() => navigate('/orders')}>
          <img src={ordersIcon} alt="Orders & Purchases Icon" className="icon" />
          <p>Orders & Purchases</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
