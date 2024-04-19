import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import LogoutButton from './LogoutButton';
import './LogoutButton.css';
import './global.css';
import { useEffect } from 'react';
import { isAuthenticated } from '../utils/authUtils';


import inventoryIcon from '../assets/inventory.png';
import ordersIcon from '../assets/oandp.png';
import suppliersIcon from '../assets/suppliers.png';
import adminIcon from '../assets/adminicon.png';
import { isAdmin } from '../utils/authUtils';

const Dashboard = () => {

  document.title = 'Dashboard';
  
  const navigate = useNavigate();
 

  const checkAuthentication = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
  };
  useEffect(() => {
    checkAuthentication();
  }, []);

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
        {isAdmin() && (
          <div className="flexBox" onClick={() => navigate('/admin')}>
            <img src={adminIcon} alt="Admin Icon" className="icon" />
            <p>Admin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
