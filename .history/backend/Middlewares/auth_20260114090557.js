const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // Try to get token from Authorization header first, then from cookies
    let token = null;
    
    // Check Authorization header (Bearer token)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    
    // If no Authorization header, check cookies
    if (!token) {
      token = req.cookies.token;
    }

    // Token nahi hai → not logged in
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    //  Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   

    //  req.user set karo - MATCH THE JWT PAYLOAD NAME (userId, not id)
    req.user = {
      id: decoded.userId
    };

    // Next route pe jao
    next();
  } catch (error) {
    console.log(" Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
