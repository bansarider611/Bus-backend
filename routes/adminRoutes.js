// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Only admins can access these
router.get("/users", authMiddleware, roleMiddleware, adminController.getTotalUsers);
router.get("/bookings", authMiddleware, roleMiddleware, adminController.getTotalBookings);
router.get("/revenue", authMiddleware, roleMiddleware, adminController.getRevenueStats);
router.put("/user/role/:id", authMiddleware, roleMiddleware, adminController.updateUserRole);

module.exports = router;
