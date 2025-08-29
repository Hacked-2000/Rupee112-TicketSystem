const db = require('../configs/dbConfig');

// Create a reply and optionally update ticket status
exports.addReply = async ({ ticket_id, user_id, message, attachments }) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
  
      const attachmentsStr = attachments ? JSON.stringify(attachments) : null;
  
      const [replyResult] = await conn.query(
        `INSERT INTO replies (ticket_id, user_id, message, attachments) VALUES (?, ?, ?, ?)`,
        [ticket_id, user_id, message, attachmentsStr]
      );
  
      await conn.commit();
      return { reply_id: replyResult.insertId };
    } catch (err) {
      await conn.rollback();
      console.error("Error inserting reply:", err);
      throw err;
    } finally {
      conn.release();
    }
  };
  

// Get all replies for a ticket
exports.getRepliesByTicketId = async (ticket_id) => {
  const [rows] = await db.query(
    `SELECT r.*, u.name AS user_name
     FROM replies r
     JOIN users u ON r.user_id = u.id
     WHERE r.ticket_id = ?
     ORDER BY r.created_at ASC`,
    [ticket_id]
  );
  return rows;
};

// Edit a reply (ensure user owns the reply)
exports.editReply = async ({ reply_id, user_id, message, attachments }) => {
  const [check] = await db.query(
    `SELECT * FROM replies WHERE id = ? AND user_id = ?`,
    [reply_id, user_id]
  );

  if (check.length === 0) {
    throw new Error('Reply not found or permission denied');
  }

  const [updateResult] = await db.query(
    `UPDATE replies SET message = ?, attachments = ? WHERE id = ?`,
    [message, attachments, reply_id]
  );

  return updateResult.affectedRows > 0;
};
