const db = require('../configs/dbConfig');

exports.getUserByEmail = async (email) => {
    try {
        const [rows] = await db.execute('SELECT id FROM users WHERE email = ? AND is_deleted = 0 LIMIT 1', [email]);
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        throw err;
    }
};

exports.createUser = async (data) => {
    try {
        const { lms_user_id, role_id, name, email, password, reporting, created_by } = data;
        const [result] = await db.execute(
            `INSERT INTO users (lms_user_id, role_id, reporting, name, email, password, is_active, is_deleted, created_by, created_at)
             VALUES (?, ?, ?, ?, ?, ?, 1, 0, ?, NOW())`,
            [lms_user_id, role_id, reporting, name, email, password, created_by]
        );
        return result.insertId;
    } catch (err) {
        throw err;
    }
};

exports.updateUser = async (id, data) => {
    try {
        const [existingUser] = await db.query(
            `SELECT id FROM users WHERE id = ? AND is_deleted = 0`,
            [id]
        );
        if (existingUser.length === 0) {
            return { error: 'User not found' };
        }

        const allowedFields = ['lms_user_id', 'role_id', 'name', 'updated_by', 'reporting', 'is_active', 'is_deleted'];
        const updates = Object.entries(data)
            .filter(([key, val]) => allowedFields.includes(key) && val !== undefined)
            .reduce((acc, [key, val]) => {
                acc.fields.push(`${key} = ?`);
                acc.values.push(val);
                return acc;
            }, { fields: [], values: [] });

        if (updates.fields.length === 0) {
            return { error: 'No valid fields provided for update' };
        }

        // Validate uniqueness of lms_user_id if present
        if ('lms_user_id' in data) {
            const [dup] = await db.query(
                `SELECT id FROM users WHERE lms_user_id = ? AND id != ? AND is_deleted = 0`,
                [data.lms_user_id, id]
            );
            if (dup.length > 0) {
                return { error: 'lms_user_id already exists' };
            }
        }

        updates.fields.push(`updated_at = NOW()`); // Add timestamp
        updates.values.push(id); // ID for WHERE clause

        await db.query(
            `UPDATE users SET ${updates.fields.join(', ')} WHERE id = ?`,
            updates.values
        );

        return { success: true };
    } catch (error) {
        console.error('Update User Error:', error);
        return { error: 'Internal Server Error' };
    }
};


exports.deleteUser = async (id) => {
    try {
        const [result] = await db.query(
            `UPDATE users SET is_deleted = 1, updated_at = NOW() WHERE id = ?`,
            [id]
        );
        return result.affectedRows;
    } catch (err) {
        console.error('Delete User Error:', err);
        throw err;
    }
};

exports.getUsers = async ({ page = 1, limit = 100, role_id = null }) => {
    try {
        const offset = (page - 1) * limit;
        const filters = [`u.is_deleted = 0`];
        const params = [];

        if (role_id) {
            filters.push(`u.role_id = ?`);
            params.push(role_id);
        }

        const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

        const [rows] = await db.query(
            `SELECT u.id, u.lms_user_id, u.role_id, u.reporting, r.name AS reporting_name, u.name, u.email, u.is_active, u.created_at
             FROM users u
             LEFT JOIN users r ON u.reporting = r.id
             ${whereClause}
             ORDER BY u.id DESC
             LIMIT ? OFFSET ?`,
            [...params, parseInt(limit), parseInt(offset)]
        );

        const [countResult] = await db.query(
            `SELECT COUNT(*) as total FROM users u ${whereClause}`,
            params
        );

        return {
            users: rows,
            total: countResult[0].total,
            page: parseInt(page),
            limit: parseInt(limit)
        };
    } catch (err) {
        console.error('Get Users Error:', err);
        throw err;
    }
};

