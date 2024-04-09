const express = require('express');
const pool = require('../db');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

console.log(authenticateToken, authorizeRole)

router.get('/users', authenticateToken, authorizeRole(1), async (req, res) => {
    try {
        const allUsersWithRoleNames = await pool.query(`
            SELECT users.id, users.username, roles.name AS role_name
            FROM users
            LEFT JOIN roles ON users.role_id = roles.id
        `);

        const formattedUsers = allUsersWithRoleNames.rows.map(user => ({
            id: user.id,
            username: user.username,
            role_name: user.role_name || 'No Role'  
        }));

        res.json(formattedUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
