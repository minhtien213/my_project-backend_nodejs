const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/UserController');
const { authMiddleware, authUserMiddleware } = require('../app/middlewares/authMiddleware');

router.post('/sign-up', userController.createUser);
router.post('/sign-in', userController.loginUser);
router.put('/update-user/:id', userController.updateUser);
router.delete('/delete-user/:id', authMiddleware, userController.deleteUser);
router.get('/get-all-users', authMiddleware, userController.getAllUsers);
router.get('/get-detail-user/:id', authUserMiddleware, userController.getDetailUser);

module.exports = router;