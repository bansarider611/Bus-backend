// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader)
    return res.status(401).json({ message: "Access denied, token missing" });

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  if (!token)
    return res.status(401).json({ message: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user data
    next();
  } catch (err) {
    console.error("❌ Token error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
