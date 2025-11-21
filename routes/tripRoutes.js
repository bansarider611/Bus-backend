const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// ===============================
// 🟢 Test Route
// ===============================
router.get("/test", (req, res) => {
  res.json({ success: true, message: "Trip route working ✅" });
});

// ===============================
// 🟢 Get All Trips
// ===============================
router.get("/all", async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        T.ID,
        T.BUS_ID,
        B.NAME AS BUS_NAME,
        T.ROUTE_ID,
        R.\`From\` AS START_CITY,
        R.\`To\` AS END_CITY,
        R.DISTANCE_KM,
        T.DEPARTURE_DATETIME,
        T.ARRIVAL_DATETIME,
        T.PRICE
      FROM TRIPS T
      JOIN BUSES B ON T.BUS_ID = B.ID
      JOIN ROUTES R ON T.ROUTE_ID = R.ID
      ORDER BY T.DEPARTURE_DATETIME ASC
    `);

    res.json({ success: true, total: rows.length, trips: rows });
  } catch (err) {
    console.error("❌ Error fetching trips:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ===============================
// 🟢 Search Trips by From-To
// ===============================
router.get("/search", async (req, res) => {
  try {
    const { from, to, date } = req.query;
     console.log("Search Input:", from, to, date);
    if (!from || !to || !date) {
      return res.status(400).json({
        success: false,
        message: "from, to and date are required.",
      });
    }

    const [rows] = await db.promise().query(
      `
      SELECT 
        T.ID,
        B.NAME AS BUS_NAME,
        R.\`From\` AS START_CITY,
        R.\`To\` AS END_CITY,
        R.DISTANCE_KM,
        T.DEPARTURE_DATETIME,
        T.ARRIVAL_DATETIME,
        T.PRICE
      FROM TRIPS T
      JOIN BUSES B ON T.BUS_ID = B.ID
      JOIN ROUTES R ON T.ROUTE_ID = R.ID
      WHERE LOWER(R.\`From\`) = LOWER(?) 
        AND LOWER(R.\`To\`) = LOWER(?)
        AND DATE(T.DEPARTURE_DATETIME) = ?
      ORDER BY T.DEPARTURE_DATETIME ASC
      `,
      [from, to, date]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No trips found from ${from} to ${to} on ${date}.`,
      });
    }

    res.status(200).json({ success: true, total: rows.length, trips: rows });
  } catch (err) {
    console.error("❌ Error searching trips:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ===============================
// 🟢 Get Trip by ID
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.promise().query(
      `
      SELECT 
        T.ID,
        T.BUS_ID,
        B.NAME AS BUS_NAME,
        T.ROUTE_ID,
        R.\`From\` AS START_CITY,
        R.\`To\` AS END_CITY,
        R.DISTANCE_KM,
        T.DEPARTURE_DATETIME,
        T.ARRIVAL_DATETIME,
        T.PRICE
      FROM TRIPS T
      JOIN BUSES B ON T.BUS_ID = B.ID
      JOIN ROUTES R ON T.ROUTE_ID = R.ID
      WHERE T.ID = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Trip not found!" });
    }

    res.status(200).json({ success: true, trip: rows[0] });
  } catch (err) {
    console.error("❌ Error fetching trip:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ===============================
// 🟢 Add New Trip
// ===============================
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { bus_id, route_id, departure_ts, arrival_ts, price } = req.body;

    if (!bus_id || !route_id || !departure_ts || !arrival_ts || !price) {
      return res.status(400).json({
        success: false,
        message: "All fields including price are required!",
      });
    }

    await db.promise().query(
      "INSERT INTO TRIPS (BUS_ID, ROUTE_ID, DEPARTURE_DATETIME, ARRIVAL_DATETIME, PRICE) VALUES (?, ?, ?, ?, ?)",
      [bus_id, route_id, departure_ts, arrival_ts, price]
    );

    res
      .status(201)
      .json({ success: true, message: "Trip added successfully ✅" });
  } catch (err) {
    console.error("❌ Error adding trip:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ===============================
// 🟢 Delete Trip by ID
// ===============================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db
      .promise()
      .query("DELETE FROM TRIPS WHERE ID = ?", [id]);

    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ success: false, message: "Trip not found!" });

    res.json({ success: true, message: "Trip deleted successfully ✅" });
  } catch (err) {
    console.error("❌ Error deleting trip:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;
