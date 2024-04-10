const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

// Middleware function to authenticate a JWT token, gives user role to user as well for access control
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); 
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.sendStatus(403);
        }
    
        try {
            const userId = user.id;

            const userRecord = await pool.query('SELECT role_id FROM users WHERE id = $1', [userId]);
    
            if (!userRecord.rows || userRecord.rows.length === 0) {
                return res.sendStatus(403); 
            }
    
            req.user = user;
            req.user.role_id = userRecord.rows[0].role_id;
            next();
        } catch (error) {
            console.error('Error fetching user:', error);
            res.sendStatus(500); 
        }
    });
    
}

module.exports = authenticateToken;
