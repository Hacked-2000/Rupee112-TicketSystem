const db = require('../configs/dbConfig');

// Check if email exists in the database
exports.checkEmailExists = async (email) => {
    try {
        const [rows] = await db.query(
            `SELECT id FROM users WHERE email = ? AND is_deleted = 0`,
            [email]
        );
        return rows.length > 0;
    } catch (err) {
        console.error('Error checking email existence:', err);
        throw err;
    }
};

// Authenticate user by email and hashed password
exports.authenticateUser = async (email, password) => {
    try {
        const [users] = await db.query(
            `SELECT * FROM users WHERE email = ? AND password = ? AND is_active = 1 AND is_deleted = 0`,
            [email, password]
        );

        if (users.length === 0) return null;

        const user = users[0];

        const [roles] = await db.query(
            `SELECT UR.role_id, MR.name 
             FROM users UR 
             LEFT JOIN master_roles MR ON UR.role_id = MR.id 
             WHERE UR.id = ? 
             ORDER BY MR.id DESC`,
            [user.id]
        );
        //    console.log({roles});

        return {
            id: user.id,
            role_id: roles[0]?.role_id || null,
            role_name: roles[0]?.name || null,
            name: user.name,
            email: user.email
        };

    } catch (err) {
        console.error('Error authenticating user:', err);
        throw err;
    }
};


exports.updatePassword = async (email, newPassword) => {
    try {
        const [result] = await db.query(x
            `UPDATE users SET password = ?, updated_at = NOW() WHERE email = ? AND is_active = 1 AND is_deleted = 0`,
            [newPassword, email]
        );
        return result.affectedRows > 0;
    } catch (err) {
        console.error('Error updating password:', err);
        throw err;
    }
};

exports.getAllRoles = async () => {
    try {
        const [rows] = await db.query(`SELECT id, name FROM master_roles ORDER BY id ASC`);
        return rows;
    } catch (err) {
        console.error('Error fetching roles:', err);
        throw err;
    }
};
