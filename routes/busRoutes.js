const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Get all buses
router.get("/all", async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM BUSES");
    res.json({ success: true, total: rows.length, buses: rows });
  } catch (err) {
    console.error("❌ Error fetching buses:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ✅ Get single bus by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.promise().query("SELECT * FROM BUSES WHERE ID = ?", [id]);

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "Bus not found!" });

    res.json({ success: true, bus: rows[0] });
  } catch (err) {
    console.error("❌ Error fetching bus:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ✅ Add new bus (protected route)
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { name, operator_id, total_seat, layout } = req.body;

    if (!name || !operator_id || !total_seat || !layout) {
      return res.status(400).json({ success: false, message: "All fields required!" });
    }

    await db
      .promise()
      .query(
        "INSERT INTO BUSES (NAME, OPERATOR_ID, TOTAL_SEAT, LAYOUT) VALUES (?, ?, ?, ?)",
        [name, operator_id, total_seat, JSON.stringify(layout)]
      );

    res.status(201).json({ success: true, message: "Bus added successfully ✅" });
  } catch (err) {
    console.error("❌ Error adding bus:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ✅ Delete bus by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.promise().query("DELETE FROM BUSES WHERE ID = ?", [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: "Bus not found!" });

    res.json({ success: true, message: "Bus deleted successfully ✅" });
  } catch (err) {
    console.error("❌ Error deleting bus:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;
