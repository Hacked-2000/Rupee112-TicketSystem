const express = require('express');
const { body } = require('express-validator');
const ticketreplyController = require('../controllers/ticketreplyController');
const verifyToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

// Add a reply to a ticket
router.post(
  '/tickets/:ticket_id/replies',
  verifyToken,
  upload.array('attachments', 5),
  [
    body('user_id').isInt().withMessage('User ID must be an integer'),
    body('message').notEmpty().withMessage('Message is required'),
  ],
  ticketreplyController.addReply
);

// Get replies by ticket ID
router.get('/tickets/:ticket_id/replies', verifyToken, ticketreplyController.getTicketDetails);

// Edit a reply
router.put(
  '/replies/:reply_id',
  verifyToken,
  upload.array('attachments', 5),
  [
    body('user_id').isInt().withMessage('User ID must be an integer'),
    body('message').notEmpty().withMessage('Message is required')
  ],
  ticketreplyController.editReply
);

module.exports = router;
