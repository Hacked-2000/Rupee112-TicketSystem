const replyModel = require('../models/replyModel');
const ticketModel=require('../models/ticketModel')

exports.addReply = async (req, res) => {
  const { ticket_id, user_id, message, attachments} = req.body;
  try {
    const result = await replyModel.addReply({ ticket_id, user_id, message, attachments });

    return res.status(201).json({
        status: 'success',
        status_code: 201,
        message: 'Reply Sent successfully',
        data: { reply_id: result?.reply_id }
      });

  } catch (err) {
    console.error('Error adding reply:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getTicketDetails = async (req, res) => {
  const { ticket_id } = req.params

  try {
    // Fetch main ticket details
    const ticket = await ticketModel.getTicketById(ticket_id)
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' })
    }

    // Fetch replies
    const replies = await replyModel.getRepliesByTicketId(ticket_id)
    ticket.replies = replies
   

    res.json({ success: true, ticket,message:'Ticket Details fetched successfully' })
  } catch (err) {
    console.error('Error fetching ticket details:', err.message)
    res.status(500).json({ success: false, error: err.message })
  }
}


exports.editReply = async (req, res) => {
  const { reply_id, user_id, message, attachments } = req.body;
  try {
    const success = await replyModel.editReply({ reply_id, user_id, message, attachments });
    res.json({ success });
  } catch (err) {
    console.error('Error editing reply:', err.message);
    res.status(403).json({ success: false, error: err.message });
  }
};
