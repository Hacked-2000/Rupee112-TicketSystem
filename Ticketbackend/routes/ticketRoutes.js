const express = require('express');
const { body } = require('express-validator');
const ticketController = require('../controllers/ticketController');
const verifyToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.post(
  '/tickets',
  verifyToken,
  upload.array('attachments', 10), // Accept up to 10 files
  [
    body('user_id').isInt().withMessage('User ID must be an integer'),
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['open', 'in_progress', 'resolved', 'closed'])
    .withMessage('Invalid status value Entered only open, in_progress, resolved, closed'),
  body('updated_by').optional().isInt().withMessage('updated_by must be an integer')
  ],
  ticketController.createTicket
);

router.post('/tickets/status',verifyToken,ticketController?.changeTicketStatus)

router.post('/tickets/selfallocate',verifyToken,ticketController.selfAllocateTicket)

router.get('/tickets', verifyToken, ticketController.getTickets);

router.get('/tickets/status-count', verifyToken, ticketController.getTicketStatusCount);

router.get('/notifications/:user_id',verifyToken,ticketController?.fetchnotifs)



module.exports = router;
