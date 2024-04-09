function authorizeRole(roleId) {
    return (req, res, next) => {
        const { role_id } = req.user;
  
        // Check if user's role matches the required roleId
        if (role_id !== roleId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // User is authorized, proceed to the next middleware or route handler
        next();
    };
}

module.exports = authorizeRole;
