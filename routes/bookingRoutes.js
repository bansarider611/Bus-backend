const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bookingController = require("../controllers/bookingController");

// ✅ 1️⃣ Add New Booking
router.post("/add", (req, res) => {
  const { user_id, trip_id, amount, status } = req.body;

  if (!user_id || !trip_id || !amount) {
    return res
      .status(400)
      .json({ message: "user_id, trip_id, and amount are required" });
  }

  const bookingStatus = status || "PENDING";
  const sql = `INSERT INTO BOOKING (USER_ID, TRIP_ID, AMOUNT, STATUS) VALUES (?, ?, ?, ?)`;

  db.query(sql, [user_id, trip_id, amount, bookingStatus], (err, result) => {
    if (err) {
      console.error("Error adding booking:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(201).json({
      message: "Booking created successfully",
      booking_id: result.insertId,
    });
  });
});

// ✅ 2️⃣ Get All Bookings
router.get("/all", (req, res) => {
  const sql = `
    SELECT 
      b.ID, 
      b.USER_ID, 
      u.NAME AS USER_NAME, 
      b.TRIP_ID, 
      t.BUS_ID, 
      b.AMOUNT, 
      b.STATUS, 
      b.CREATED_AT
    FROM BOOKING b
    JOIN USERS u ON b.USER_ID = u.ID
    JOIN TRIPS t ON b.TRIP_ID = t.ID
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching bookings:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
});

// ✅ 3️⃣ Get Booking by ID
router.get("/:id", (req, res) => {
  const bookingId = req.params.id;
  const sql = "SELECT * FROM BOOKING WHERE ID = ?";

  db.query(sql, [bookingId], (err, result) => {
    if (err) {
      console.error("Error fetching booking:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(result[0]);
  });
});

// ✅ NEW: Get all bookings of a logged-in user
router.get("/user/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 
      b.ID AS BOOKING_ID,
      b.USER_ID,
      b.AMOUNT,
      b.STATUS,
      b.CREATED_AT,
      bus.NAME AS BUS_NAME,
      r.\`From\` AS FROM_CITY,
      r.\`To\` AS TO_CITY,
      t.DEPARTURE_DATETIME AS DEPARTURE_TS,
      t.ARRIVAL_DATETIME AS ARRIVAL_TS,
      GROUP_CONCAT(bs.SEAT_NO ORDER BY bs.SEAT_NO ASC) AS SEATS
    FROM BOOKING b
    JOIN TRIPS t ON b.TRIP_ID = t.ID
    JOIN ROUTES r ON t.ROUTE_ID = r.ID
    JOIN BUSES bus ON t.BUS_ID = bus.ID
    LEFT JOIN BOOKING_SEATS bs ON b.ID = bs.BOOKING_ID
    WHERE b.USER_ID = ?
    GROUP BY b.ID
    ORDER BY b.CREATED_AT DESC;
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching user bookings:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }

    res.json({ success: true, bookings: results });
  });
});


// ✅ 4️⃣ Update Booking (Amount or Status)
router.put("/update/:id", (req, res) => {
  const bookingId = req.params.id;
  const { amount, status } = req.body;

  if (!amount && !status) {
    return res
      .status(400)
      .json({ message: "Provide at least one field to update" });
  }

  let fields = [];
  let values = [];

  if (amount) {
    fields.push("AMOUNT = ?");
    values.push(amount);
  }
  if (status) {
    fields.push("STATUS = ?");
    values.push(status);
  }

  values.push(bookingId);

  const sql = `UPDATE BOOKING SET ${fields.join(", ")} WHERE ID = ?`;

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating booking:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ message: "Booking updated successfully" });
  });
});

// ✅ 5️⃣ Delete Booking
router.delete("/delete/:id", (req, res) => {
  const bookingId = req.params.id;
  const sql = "DELETE FROM BOOKING WHERE ID = ?";

  db.query(sql, [bookingId], (err, result) => {
    if (err) {
      console.error("Error deleting booking:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ message: "Booking deleted successfully" });
  });
});

router.post("/send-ticket/:id", bookingController.sendTicket);

// ✅ 6️⃣ Create booking with seats (Option 1 — insert into SEATS + BOOKING_SEATS)
router.post("/create-with-seats", async (req, res) => {
  const dbPromise = db.promise();

  try {
    const { user_id, trip_id, seats } = req.body;

    if (!user_id || !trip_id || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: "user_id, trip_id, and seats are required.",
      });
    }

    // ✅ Start transaction
    await dbPromise.query("START TRANSACTION");

    // ✅ Check if seats already booked
    const [booked] = await dbPromise.query(
      "SELECT SEAT_NUMBER FROM SEATS WHERE TRIP_ID = ? AND STATUS = 'BOOKED'",
      [trip_id]
    );

    const alreadyBooked = booked.map((b) => b.SEAT_NUMBER);
    const conflict = seats.filter((s) => alreadyBooked.includes(s.toString()));

    if (conflict.length > 0) {
      await dbPromise.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        message: `Seats ${conflict.join(", ")} already booked.`,
      });
    }
      // ✅ Get price directly from TRIPS table
const [tripRows] = await dbPromise.query(
  `SELECT PRICE 
   FROM TRIPS
   WHERE ID = ?`,
  [trip_id]
);

if (tripRows.length === 0) {
  await dbPromise.query("ROLLBACK");
  return res.status(404).json({
    success: false,
    message: "Trip not found",
  });
}

const perSeatFare = parseFloat(tripRows[0].PRICE); // REAL PRICE
const totalAmount = perSeatFare * seats.length;

    

    // ✅ Insert into BOOKING table
    const [bookingResult] = await dbPromise.query(
      "INSERT INTO BOOKING (USER_ID, TRIP_ID, AMOUNT, STATUS) VALUES (?, ?, ?, 'PENDING')",
      [user_id, trip_id, totalAmount]
    );

    const bookingId = bookingResult.insertId;

    // ✅ Insert into SEATS table
    for (const seat of seats) {
      await dbPromise.query(
        "INSERT INTO SEATS (TRIP_ID, SEAT_NUMBER, STATUS, BOOKING_ID) VALUES (?, ?, 'BOOKED', ?)",
        [trip_id, seat.toString(), bookingId]
      );
    }

    // ✅ Also insert into BOOKING_SEATS table (for email)
    const seatValues = seats.map((seat) => [bookingId, seat.toString()]);
    await dbPromise.query(
      "INSERT INTO BOOKING_SEATS (BOOKING_ID, SEAT_NO) VALUES ?",
      [seatValues]
    );

    // ✅ Commit transaction
    await dbPromise.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Booking created successfully ✅",
      booking_id: bookingId,
      total_amount: totalAmount,
      per_seat: perSeatFare,
      total_seats: seats.length,
    });
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    await db.promise().query("ROLLBACK");
    res.status(500).json({
      success: false,
      message: "Server error while creating booking.",
    });
  }
});
// ✅ Cancel Booking & Free Seats (Recommended Version)
router.put("/cancel/:id", (req, res) => {
  const bookingId = req.params.id;

  // Step 1️⃣ — Cancel booking
  const cancelBookingSQL = `
    UPDATE BOOKING 
    SET STATUS = 'CANCELLED' 
    WHERE ID = ? AND STATUS != 'CANCELLED'
  `;

  db.query(cancelBookingSQL, [bookingId], (err, result) => {
    if (err) {
      console.error("❌ Error cancelling booking:", err);
      return res.status(500).json({
        success: false,
        message: "Database error while cancelling booking.",
      });
    }

    if (result.affectedRows === 0) {
      return res.json({
        success: false,
        message: "Booking not found or already cancelled.",
      });
    }

    // Step 2️⃣ — Mark seats as AVAILABLE
    const freeSeatsSQL = `
      UPDATE SEATS 
      SET STATUS = 'AVAILABLE', BOOKING_ID = NULL 
      WHERE BOOKING_ID = ?
    `;

    db.query(freeSeatsSQL, [bookingId], (seatErr, seatResult) => {
      if (seatErr) {
        console.error("❌ Error freeing seats:", seatErr);
        return res.status(500).json({
          success: false,
          message: "Booking cancelled, but failed to free seats.",
        });
      }

      console.log(
        `✅ Booking ${bookingId} cancelled and  seats freed successfully!.`
      );

      res.json({
        success: true,
        message: "Booking cancelled successfully! Seats are now available again.",
      });
    });
  });
});



// ✅ 7️⃣ Get all booked seats for a specific trip
// ✅ Get all currently booked seats for a specific trip
router.get("/booked-seats/:trip_id", async (req, res) => {
  const { trip_id } = req.params;

  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT SEAT_NUMBER FROM SEATS WHERE TRIP_ID = ? AND STATUS = 'BOOKED'",
        [trip_id]
      );

    const bookedSeats = rows.map((s) => parseInt(s.SEAT_NUMBER));
    res.json({ success: true, bookedSeats });
  } catch (error) {
    console.error("❌ Error fetching booked seats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching booked seats",
      error: error.message,
    });
  }
});


module.exports = router;
