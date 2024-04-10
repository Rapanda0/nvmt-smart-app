//CODE TO RESTRICT ACCESS TO APIS BASED ON ROLES

function authorizeRole(roleId) {
    return (req, res, next) => {
        const { role_id } = req.user;
  
        if (role_id !== roleId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        next();
    };
}

module.exports = authorizeRole;
