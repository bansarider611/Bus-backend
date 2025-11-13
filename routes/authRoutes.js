// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getProfile } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// PUBLIC ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);

// PROTECTED ROUTES
router.get("/profile", authMiddleware, getProfile);

// TEST ROUTE
router.get("/test", (req, res) => {
  res.json({ success: true, message: "Auth routes working ✅" });
});

module.exports = router;
