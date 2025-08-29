const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/loginController');
const verifyToken = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');


const router = express.Router();


// Login
router.post(
  '/login',
  [
    body('user_email').isEmail().notEmpty().withMessage('Invalid email format').bail(),
    body('user_password').notEmpty().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').bail()
  ],
  authController.login
);

router.post('/reset-password', [
  body('email').isEmail().notEmpty().withMessage('Invalid email format').bail(),
  body('old_password').notEmpty().withMessage('Old password is required').bail(),
  body('new_password').notEmpty().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').bail()
], authController.resetPassword);



//Roles
router.get('/roles', verifyToken, authController.getRoles);


// Users

router.post('/users', verifyToken,
  [
    body('email').isEmail().notEmpty().withMessage('Invalid email format').bail(),
    body('password').notEmpty().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').bail()
  ],
  userController.createUser);

router.put('/users/:id', verifyToken, userController.updateUser);
router.delete('/users/:id', verifyToken, userController.deleteUser);
router.get('/users', verifyToken, userController.getUsers);



// Example protected route
router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});

module.exports = router;
