const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // Cookie se token nikalo
    const token = req.cookies.token;

   

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
