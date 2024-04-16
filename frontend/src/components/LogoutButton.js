import React from 'react';

const LogoutButton = () => {
  const handleLogout = () => {
    // clearing token and role from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    window.location.href = '/'; // Redirect using JavaScript
  };

  return (
    <button onClick={handleLogout} className='logoutButton'>Logout</button>
  );
};

export default LogoutButton;

// try {
//   const { username, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, saltRounds);
//   const role_id = 3;

//   const newUser = await pool.query(
//     'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
//     [username, hashedPassword]
//     'INSERT INTO users (username, password, role_id) VALUES ($1, $2, $3) RETURNING *',
//     [username, hashedPassword, role_id]
//   );