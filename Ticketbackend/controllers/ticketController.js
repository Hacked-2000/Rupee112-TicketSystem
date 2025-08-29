const { validationResult } = require('express-validator');
const TicketModel = require('../models/ticketModel');

exports.createTicket = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'failure',
      status_code: 400,
      message: 'Validation failed',
      data: null,
      errors: errors.array().map(err => ({
        type: 'field',
        msg: err.msg,
        path: err.param,
        location: err.location
      }))
    });
  }

  try {
    const { user_id, title, description, updated_by, status } = req.body;
    const attachmentPaths = req.files.map(file => `/uploads/${file.filename}`);

    const ticketId = await TicketModel.createTicket({
      user_id,
      title,
      description,
      status,
      attachments: JSON.stringify(attachmentPaths),
      updated_by: updated_by || null
    });

    return res.status(201).json({
      status: 'success',
      status_code: 201,
      message: 'Ticket created successfully',
      data: { ticket_id: ticketId }
    });
  } catch (err) {
    console.error('Ticket creation error:', err);
    return res.status(500).json({
      status: 'error',
      status_code: 500,
      message: 'Internal Server Error',
      data: null,
      errors: "Ticket creation error: " + err.message
    });
  }
};



exports.getTickets = async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate,user_id,role_id,status } = req.query;
    const offset = (page - 1) * limit;

    const filters = {
      startDate,
      endDate,
      limit: parseInt(limit),
      offset: parseInt(offset),
      user_id:user_id,
      role_id:role_id,
      status:status

    };

    const tickets = await TicketModel.getTickets(filters);
    const total = await TicketModel.getTicketCount(filters);

    return res.status(200).json({
      status: 'success',
      status_code: 201,
      message: 'Tickets retrieved successfully',
      data: {
        tickets,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      },
      errors: null
    });
  } catch (err) {
    console.error('Ticket list error:', err);
    return res.status(500).json({
      status: 'error',
      status_code: 500,
      message: 'Internal Server Error',
      data: null,
      errors: "Ticket list error: " + err.message
    });
  }
}



exports.getTicketStatusCount = async (req, res) => {
    try {
        const { startDate, endDate, user_id } = req.query;

        const filters = { startDate, endDate, user_id };
        const counts = await TicketModel.getStatusCounts(filters);

        return res.status(200).json({
            status: 'success',
            status_code: 200,
            message: 'Status counts retrieved successfully',
            data: counts,
            errors: null
        });
    } catch (err) {
        console.error('Status count error:', err);
        return res.status(500).json({
          status: 'error',
          status_code: 500,
          message: 'Internal Server Error',
          data: null,
          errors: "Status count error: " + err.message
        });
    }
};

exports.changeTicketStatus = async (req, res) => {
  try {
      const { ticket_id,new_status,updated_by } = req.body;
    let obj={
      ticket_id,new_status,updated_by
    }
    
      const ticket = await TicketModel.changeTicketStatus(obj);

      return res.status(200).json({
          status: 'success',
          status_code: 200,
          message: new_status==='resolved'?'Ticket has been resolved':'Ticket has been reopened',
          data: ticket,
          errors: null
      });
  } catch (err) {
      console.error('Status count error:', err);
      return res.status(500).json({
        status: 'error',
        status_code: 500,
        message: 'Internal Server Error',
        data: null,
        errors: "Status count error: " + err.message
      });
  }
};

exports.selfAllocateTicket = async (req, res) => {
  try {
      const { ticket_id,user_id } = req.body;
    let obj={
      ticket_id,user_id
    }
    
      const ticket = await TicketModel.selfAllocateTicket(obj);

      return res.status(200).json({
          status: 'success',
          status_code: 200,
          message:'Ticket has been allocated',
          data: ticket,
          errors: null
      });
  } catch (err) {
      console.error('Status count error:', err);
      return res.status(500).json({
        status: 'error',
        status_code: 500,
        message: 'Internal Server Error',
        data: null,
        errors: "Status count error: " + err.message
      });
  }
};


exports.fetchnotifs=async (req, res) => {
  try {
      const { user_id } = req.params;
      const tickets = await TicketModel.getInProgressTicketsByUser(user_id);
      
     return res.status(200).json({
          status: 'success',
          status_code: 200,
          message:'Fetched',
          data: tickets,
          errors: null
      });
  } catch (err) {
      console.error('Status count error:', err);
      return res.status(500).json({
        status: 'error',
        status_code: 500,
        message: 'Internal Server Error',
        data: null,
        errors: "Status count error: " + err.message
      });
  }
};

