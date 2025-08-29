// Get all tickets with pagination and filters
export const getTickets = async (page = 1, limit = 25, status = '') => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
  
  // Apply status filter if specified
  if (status) {
    tickets = tickets.filter(ticket => ticket.status === status);
  }
  
  // Calculate pagination
  const totalItems = tickets.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    status: "success",
    data: {
      data: tickets.slice(startIndex, endIndex),
      meta: {
        total_items: totalItems,
        total_pages: totalPages,
        current_page: page,
        per_page: limit
      }
    }
  };
};

// Get ticket by ID
export const getTicketById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
  const ticket = tickets.find(t => t.id === parseInt(id));
  
  if (!ticket) {
    throw new Error('Ticket not found');
  }
  
  return {
    status: "success",
    data: ticket
  };
};

// Create new ticket
export const createTicket = async (ticketData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Find a support user to assign the ticket to
  const supportUsers = users.filter(u => u.role_id === 3 && u.is_active && !u.is_deleted);
  const assignedTo = supportUsers[Math.floor(Math.random() * supportUsers.length)];
  
  const creator = users.find(u => u.id === ticketData.user_id);
  
  const newTicket = {
    ...ticketData,
    id: tickets.length + 1,
    status: 'open',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by_name: creator?.name || 'Unknown',
    assigned_to: assignedTo?.id,
    assigned_to_name: assignedTo?.name || 'Unassigned',
    replies: [],
    attachments: Array.from(ticketData.attachments || []).map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }))
  };
  
  tickets.push(newTicket);
  localStorage.setItem('tickets', JSON.stringify(tickets));
  
  return {
    status: "success",
    data: newTicket
  };
};

// Update ticket
export const updateTicket = async (id, ticketData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
  const ticketIndex = tickets.findIndex(t => t.id === parseInt(id));
  
  if (ticketIndex === -1) {
    throw new Error('Ticket not found');
  }
  
  const updatedTicket = {
    ...tickets[ticketIndex],
    ...ticketData,
    updated_at: new Date().toISOString()
  };
  
  if (ticketData.attachments) {
    updatedTicket.attachments = [
      ...tickets[ticketIndex].attachments,
      ...Array.from(ticketData.attachments).map(file => ({
        name: file.name,
        url: URL.createObjectURL(file)
      }))
    ];
  }
  
  tickets[ticketIndex] = updatedTicket;
  localStorage.setItem('tickets', JSON.stringify(tickets));
  
  return {
    status: "success",
    data: updatedTicket
  };
};

// Add reply to ticket
export const addTicketReply = async (ticketId, replyData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
  const ticketIndex = tickets.findIndex(t => t.id === parseInt(ticketId));
  
  if (ticketIndex === -1) {
    throw new Error('Ticket not found');
  }
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.id === replyData.user_id);
  
  const newReply = {
    id: (tickets[ticketIndex].replies?.length || 0) + 1,
    content: replyData.content,
    user_id: replyData.user_id,
    user_name: user?.name || 'Unknown',
    created_at: new Date().toISOString(),
    attachments: Array.from(replyData.attachments || []).map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }))
  };
  
  tickets[ticketIndex].replies = [...(tickets[ticketIndex].replies || []), newReply];
  tickets[ticketIndex].updated_at = new Date().toISOString();
  
  localStorage.setItem('tickets', JSON.stringify(tickets));
  
  return {
    status: "success",
    data: newReply
  };
};