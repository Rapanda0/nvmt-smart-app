import { useNavigate } from 'react-router-dom';


//admin checking utility
// NEEDS UPDATING, SHITS BUGGY AF IMO, SHOULD ONLY CHECK ADMIN, NOT IF AUTHENTICATED
const useRoleCheck = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role_id');

  if (!token) {
    navigate('/login');
    return { isAdmin: false, token: null }; 
  }

  const isAdmin = userRole === '1';
  if (!isAdmin) {
    navigate('/forbidden');
    return { isAdmin: false, token }; 
  }

  return { isAdmin: true, token }; 
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token !== null; 
  };
  

export default useRoleCheck;
