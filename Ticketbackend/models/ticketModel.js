const db = require('../configs/dbConfig');



exports.createTicket = async ({ user_id, title, description, status, attachments, updated_by }) => {
    const [result] = await db.query(
      `INSERT INTO tickets (user_id, title, description, status, attachments, updated_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, title, description, status, attachments, updated_by]
    );
  
    return result.insertId;
  };
  



// exports.getTickets = async ({ startDate, endDate, limit, offset }) => {
//     let query = `SELECT * FROM tickets WHERE 1=1`;
//     const params = [];

//     if (startDate) {
//         query += ` AND created_at >= ?`;
//         params.push(startDate);
//     }

//     if (endDate) {
//         query += ` AND created_at <= ?`;
//         params.push(endDate);
//     }

//     query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
//     params.push(limit, offset);

//     const [rows] = await db.query(query, params);
//     return rows;
// };



exports.getTickets = async ({ startDate, endDate, limit = 10, offset = 0, user_id, role_id, status }) => {
  let query = `
    SELECT 
      t.*, 
      u1.name AS user_name,
      u2.name AS allocated_name
    FROM tickets t
    LEFT JOIN users u1 ON t.user_id = u1.id
    LEFT JOIN users u2 ON t.allocated_to = u2.id
    WHERE 1=1
  `;
  const params = [];

  // Filter based on role
  if (user_id && role_id !== undefined) {
    if (role_id == 1) {
      query += ` AND t.allocated_to = ?`;
      params.push(user_id);
    } else if (role_id == 4) {
      query += ` AND t.user_id = ?`;
      params.push(user_id);
    }
  }

  // Filter by status
  if (status) {
    query += ` AND t.status = ?`;
    params.push(status);
  }

  // Date filters
  if (startDate) {
    query += ` AND DATE(t.created_at) >= ?`;
    params.push(startDate);
  }

  if (endDate) {
    query += ` AND DATE(t.created_at) <= ?`;
    params.push(endDate);
  }

  // Ensure limit and offset are integers
  const limitVal = parseInt(limit, 10);
  const offsetVal = parseInt(offset, 10);

  query += `ORDER BY t.created_at DESC LIMIT ? OFFSET ?`;
  params.push(limitVal);
  params.push(offsetVal);

  const [rows] = await db.query(query, params);
  return rows;
};





exports.getTicketCount = async ({ startDate, endDate }) => {
    let query = `SELECT COUNT(*) as count FROM tickets WHERE 1=1`;
    const params = [];

    if (startDate) {
        query += ` AND DATE(created_at) >= ?`;
        params.push(startDate);
    }

    if (endDate) {
        query += ` AND DATE(created_at) <= ?`;
        params.push(endDate);
    }

    const [[result]] = await db.query(query, params);
    return result.count;
};



// exports.getStatusCounts = async ({ startDate, endDate, user_id }) => {
//     let query = `
//         SELECT status, COUNT(*) AS count 
//         FROM tickets 
//         WHERE 1=1
//     `;
//     const params = [];

//     if (startDate) {
//         query += ` AND created_at >= ?`;
//         params.push(startDate);
//     }

//     if (endDate) {
//         query += ` AND created_at <= ?`;
//         params.push(endDate);
//     }

//     if (user_id) {
//         query += ` AND user_id = ?`;
//         params.push(user_id);
//     }

//     query += ` GROUP BY status`;

//     const [rows] = await db.query(query, params);

//     // Return status counts with 0 for missing statuses
//     const statusList = ['open', 'in_progress', 'resolved', 'closed', 'reopen'];
//     const result = {};
//     statusList.forEach(status => {
//         const found = rows.find(row => row.status === status);
//         result[status] = found ? found.count : 0;
//     });

//     return result;
// };

exports.getStatusCounts = async ({ startDate, endDate, user_id }) => {
  const params = [];
  let whereClause = 'WHERE 1=1';

  if (startDate) {
      whereClause += ' AND DATE(created_at) >= ?';
      params.push(startDate);
  }

  if (endDate) {
      whereClause += ' AND DATE(created_at) <= ?';
      params.push(endDate);
  }

  // Query for overall status counts
  const [overallRows] = await db.query(
      `SELECT status, COUNT(*) AS count FROM tickets ${whereClause} GROUP BY status`,
      params
  );

  // Query for specific user_id status counts
  let userRows = [];
  if (user_id) {
      const userParams = [...params, user_id];
      const userClause = whereClause + ' AND user_id = ?';
      [userRows] = await db.query(
          `SELECT status, COUNT(*) AS count FROM tickets ${userClause} GROUP BY status`,
          userParams
      );
  }

  const statuses = ['open', 'in_progress', 'resolved', 'closed', 'reopen'];

  const overall = {};
  statuses.forEach(status => {
      const found = overallRows.find(row => row.status === status);
      overall[status] = found ? found.count : 0;
  });

  let user = {};
  if (user_id) {
      user.user_id = Number(user_id);
      statuses.forEach(status => {
          const found = userRows.find(row => row.status === status);
          user[status] = found ? found.count : 0;
      });
  }

  return { overall, user: user_id ? user : null };
};


exports.changeTicketStatus = async ({ ticket_id, new_status, updated_by }) => {
    const [result] = await db.query(
      `UPDATE tickets SET status = ?, updated_by = ? WHERE id = ?`,
      [new_status, updated_by, ticket_id]
    );
    return result.affectedRows > 0;
  };

  exports.selfAllocateTicket = async ({ ticket_id, user_id }) => {
    const [result] = await db.query(
      `UPDATE tickets SET allocated_to = ?, status = 'in_progress', updated_by = ? WHERE id = ?`,
      [user_id, user_id, ticket_id]
    );
    return result.affectedRows > 0;
  };
  


// Fetch ticket by ID
exports.getTicketById = async (ticket_id) => {
    const [rows] = await db.execute(
      `SELECT 
         t.id, 
         t.title, 
         t.description, 
         t.status, 
         t.created_at, 
         t.updated_at,
         t.attachments,
         u1.name AS user_name,
         u2.name AS allocated_name
       FROM tickets t
       LEFT JOIN users u1 ON t.user_id = u1.id
       LEFT JOIN users u2 ON t.allocated_to = u2.id
       WHERE t.id = ?`,
      [ticket_id]
    )
  
    return rows[0]
  }

  // fetch allocated tickets by id 
  
  exports.getInProgressTicketsByUser = async (user_id) => {
    
    console.log(user_id)
    if (!user_id) throw new Error('Invalid user_id');
  
    const query = `
      SELECT 
        t.*, 
        u1.name AS user_name,
        u2.name AS allocated_name
      FROM tickets t
      LEFT JOIN users u1 ON t.user_id = u1.id
      LEFT JOIN users u2 ON t.allocated_to = u2.id
      WHERE t.allocated_to = ? AND t.status = 'in_progress'
      ORDER BY t.created_at DESC
    `;
  
    const [rows] = await db.query(query, [user_id]);
    console.log("Tickets fetched:", rows.length);
    return rows;
  };
  
  


