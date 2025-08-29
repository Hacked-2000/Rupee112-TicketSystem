const db = require('../configs/dbConfig');

exports.getOpenTickets = async () => {
    const [rows] = await db.query(
        `SELECT id FROM tickets WHERE status = 'open' AND allocated_to IS NULL ORDER BY id ASC`
    );
    return rows;
};

exports.getInProgressTicketCount = async (userId) => {
    const [rows] = await db.query(
        `SELECT COUNT(*) as count FROM tickets WHERE allocated_to = ? AND status = 'in_progress'`,
        [userId]
    );
    return rows[0].count;
};

exports.allocateTickets = async (ticketIds, userId) => {
    if (ticketIds.length === 0) return;
    await db.query(
        `UPDATE tickets SET status = 'in_progress', allocated_to = ? WHERE id IN (?)`,
        [userId, ticketIds]
    );
};
