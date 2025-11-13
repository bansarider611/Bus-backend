// controllers/adminController.js
const db = require("../config/db");

// 🧍‍♀️ 1. Get all users
exports.getTotalUsers = (req, res) => {
  const sql = "SELECT ID, NAME, EMAIL, ROLE FROM USERS";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, totalUsers: result.length, users: result });
  });
};

// 🎟️ 2. Get all bookings
exports.getTotalBookings = (req, res) => {
  const sql = `
    SELECT 
      b.ID AS BOOKING_ID,
      u.NAME AS USER,
      r.\`FROM\` AS SOURCE,
      r.\`TO\` AS DESTINATION,
      b.AMOUNT,
      b.STATUS,
      t.DEPARTURE_TS,
      t.ARRIVAL_TS
    FROM BOOKING b
    JOIN USERS  u ON b.USER_ID = u.ID
    JOIN TRIPS  t ON b.TRIP_ID = t.ID
    JOIN ROUTES r ON t.ROUTE_ID = r.ID
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ SQL Error:", err.message);
      return res.status(500).json({ success: false, message: err.message });
    }
    res.json({
      success: true,
      totalBookings: result.length,
      bookings: result,
    });
  });
};


// 💰 3. Get revenue stats
exports.getRevenueStats = (req, res) => {
  const sql = `
    SELECT 
      SUM(b.AMOUNT) AS TOTAL_REVENUE,
      COUNT(p.ID) AS TOTAL_PAYMENTS,
      SUM(CASE WHEN p.STATUS = 'SUCCESFULL' THEN 1 ELSE 0 END) AS SUCCESSFUL_PAYMENTS,
      SUM(CASE WHEN p.STATUS = 'FAILED' THEN 1 ELSE 0 END) AS FAILED_PAYMENTS
    FROM PAYMENT p
    JOIN BOOKING b ON p.BOOKING_ID = b.ID
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ SQL Error:", err.message);
      return res.status(500).json({ success: false, message: err.message });
    }

    const data = result[0];
    res.json({
      success: true,
      totalRevenue: data.TOTAL_REVENUE || 0,
      totalPayments: data.TOTAL_PAYMENTS || 0,
      successfulPayments: data.SUCCESSFUL_PAYMENTS || 0,
      failedPayments: data.FAILED_PAYMENTS || 0,
    });
  });
};


// 🧑‍💼 4. Update user role
exports.updateUserRole = (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!role) return res.status(400).json({ success: false, message: "Role is required" });

  const sql = "UPDATE USERS SET ROLE = ? WHERE ID = ?";
  db.query(sql, [role, id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: "User role updated successfully" });
  });
};
