const jwt = require('jsonwebtoken');

module.exports = function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing', success: false });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, email | useremail }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token', success: false });
  }
};
