export const isAdmin = () => {
  const userRole = localStorage.getItem('role_id');
  return userRole === '1'; 
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token !== null; 
  };
  

