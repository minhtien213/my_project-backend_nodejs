const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/UserController');
const { authMiddleware, authUserMiddleware } = require('../app/middlewares/authMiddleware');

router.post('/sign-up', userController.createUser);
router.post('/sign-in', userController.loginUser);
router.put('/update-user/:id', userController.updateUser);
router.put('/update-user/password/:id', userController.updatePassword);
router.put('/reset-password', userController.resetPassword);
router.delete('/delete-user/:id', userController.deleteUser);
router.get('/get-all', authMiddleware, userController.getAllUsers);
router.get('/get-detail/:id', authUserMiddleware, userController.getDetailUser);

module.exports = router;
