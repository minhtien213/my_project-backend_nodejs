const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/UserModel');
dotenv.config();

//check admin
const authMiddleware = (req, res, next) => {
  const token = req.headers.token.split(' ')[1]; //['beare','token']
  const user = jwt.verify(token, process.env.ACCESS_TOKEN);
  if (user?.isAdmin) {
    //thêm ? sau payload để không lỗi nếu không có token
    next();
  } else {
    return res.status(404).json({
      status: 'ERROR',
      message: 'The user is not authorized',
    });
  }
};

//check user
const authUserMiddleware = (req, res, next) => {
  const userId = req.params.id;
  const token = req.headers.token.split(' ')[1]; //['beare','token']
  const user = jwt.verify(token, process.env.ACCESS_TOKEN);
  if (user?.isAdmin || user?.id === userId) {
    next();
  } else {
    return res.status(404).json({
      status: 'ERROR',
      message: 'The user is not authorized',
    });
  }
};

module.exports = { authMiddleware, authUserMiddleware };
