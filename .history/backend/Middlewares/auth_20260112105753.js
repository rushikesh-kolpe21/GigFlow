const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // 1️⃣ Cookie se token nikalo
    const token = req.cookies.token;

    // 2️⃣ Token nahi hai → not logged in
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // 3️⃣ Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ req.user set karo (VERY IMPORTANT)
    req.user = {
      id: decoded.id
    };

    // 5️⃣ Next route pe jao
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
