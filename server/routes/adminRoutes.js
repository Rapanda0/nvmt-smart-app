const express = require('express');
const pool = require('../db');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole'); // remove these for testing

//ADD AUTHENTICATE TOKEN AND AUTHORTIZE ROLE AFTER TESTIN!!!!
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

//get user by id
router.get('/users/:userId', authenticateToken, authorizeRole(1), async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await pool.query(`
            SELECT users.id, users.username, roles.name AS role_name
            FROM users
            LEFT JOIN roles ON users.role_id = roles.id
            WHERE users.id = $1
        `, [userId]);

        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const formattedUser = {
            id: user.rows[0].id,
            username: user.rows[0].username,
            role_name: user.rows[0].role_name || 'No Role'
        };

        res.json(formattedUser);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Server error');
    }
});

//delete user functionality
router.delete('/users/:userId', authenticateToken, authorizeRole(1), async (req, res) => {
    const userId = req.params.userId;

    try {
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Server error');
    }
});

// Update user by ID
router.put('/users/:userId', authenticateToken, authorizeRole(1), async (req, res) => {
    const userId = req.params.userId;
    const { username, role_id} = req.body;

    try {

        const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        await pool.query(
            'UPDATE users SET username = $1, role_id = $2 WHERE id = $3',
            [username, role_id, userId]
        );

        const updatedUser = await pool.query(`
            SELECT users.id, users.username, role_id, roles.name AS role_name
            FROM users
            LEFT JOIN roles ON users.role_id = roles.id
            WHERE users.id = $1
        `, [userId]);

        if (updatedUser.rows.length === 0) {
            return res.status(404).json({ message: 'Updated user not found' });
        }

        const formattedUser = {
            id: updatedUser.rows[0].id,
            username: updatedUser.rows[0].username,
            role_name: updatedUser.rows[0].role_name || 'No Role'
        };

        res.json(formattedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
