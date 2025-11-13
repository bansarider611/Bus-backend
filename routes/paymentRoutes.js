const express = require("express");
const router = express.Router();
const db = require("../config/db");
const transporter = require("../config/mail");
require("dotenv").config();

// ✅ 1️⃣ Add Payment + Send Email Confirmation
router.post("/add", async (req, res) => {
  const { booking_id, provider, provider_payment_id, status } = req.body;

  if (!booking_id || !provider || !provider_payment_id) {
    return res.status(400).json({
      success: false,
      message: "booking_id, provider, and provider_payment_id are required",
    });
  }

  const paymentStatus = status || "PENDING";

  const insertSql = `
    INSERT INTO PAYMENT (BOOKING_ID, PROVIDER, PROVIDER_PAYMENT_ID, STATUS)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    insertSql,
    [booking_id, provider, provider_payment_id, paymentStatus],
    (err, result) => {
      if (err) {
        console.error("❌ Error adding payment:", err);
        return res.status(500).json({
          success: false,
          message: "Database error while adding payment",
        });
      }

      // ✅ Auto-update Booking Status
      let newBookingStatus = "PENDING";
      if (paymentStatus === "SUCCESSFUL") newBookingStatus = "SUCCESSFUL";
      else if (paymentStatus === "FAILED") newBookingStatus = "FAILED";

      const updateBookingSql = "UPDATE BOOKING SET STATUS = ? WHERE ID = ?";
      db.query(updateBookingSql, [newBookingStatus, booking_id]);

      // ✅ Fetch user, trip & route info
     const fetchSql = `
  SELECT 
    b.ID AS BOOKING_ID,
    u.EMAIL AS USER_EMAIL,
    u.NAME AS USER_NAME,
    bus.NAME AS BUS_NAME,
    r.\`From\` AS START_CITY,
    r.\`To\` AS END_CITY,
    t.DEPARTURE_TS,
    t.ARRIVAL_TS,
    GROUP_CONCAT(bs.SEAT_NO ORDER BY bs.SEAT_NO ASC) AS SEATS
  FROM BOOKING b
  JOIN USERS u ON b.USER_ID = u.ID
  JOIN TRIPS t ON b.TRIP_ID = t.ID
  JOIN ROUTES r ON t.ROUTE_ID = r.ID
  JOIN BUSES bus ON t.BUS_ID = bus.ID
  JOIN BOOKING_SEATS bs ON b.ID = bs.BOOKING_ID
  WHERE b.ID = ?
  GROUP BY b.ID;
`;


      db.query(fetchSql, [booking_id], async (fetchErr, results) => {
        if (fetchErr || results.length === 0) {
          console.error("⚠️ Error fetching email data:", fetchErr);
          return res.status(201).json({
            success: true,
            message: "Payment added & booking updated (email skipped)",
          });
        }

        const data = results[0];
        const seats = data.SEATS ? data.SEATS.split(",").join(", ") : "N/A";

        const emailHtml = `
          <div style="font-family: 'Poppins', sans-serif; background-color: #fff7f0; padding: 25px; border-radius: 10px;">
            <h2 style="color: #ff7a00;">🎟️ GoBus Ticket Confirmation</h2>
            <p>Hi ${data.USER_NAME || "Passenger"},</p>
            <p>Thank you for booking with <b>GoBus</b>! Your payment has been received successfully.</p>
            <div style="background-color: #fff; border: 2px dashed #ff7a00; border-radius: 12px; padding: 20px; margin-top: 20px;">
              <h3 style="color:#ff7a00; text-align:center;">Ticket Details</h3>
              <p><b>Bus:</b> ${data.BUS_NAME}</p>
              <p><b>Route:</b> ${data.START_CITY} → ${data.END_CITY}</p>
              <p><b>Departure:</b> ${new Date(
                data.DEPARTURE_TS
              ).toLocaleString()}</p>
              <p><b>Arrival:</b> ${new Date(
                data.ARRIVAL_TS
              ).toLocaleString()}</p>
              <p><b>Seats:</b> ${seats}</p>
              <p><b>Booking ID:</b> ${data.BOOKING_ID}</p>
              <p><b>Status:</b> ✅ ${newBookingStatus}</p>
            </div>
            <p style="margin-top: 20px;">We wish you a pleasant and safe journey!</p>
            <p style="color: #555;">- The GoBus Team</p>
          </div>
        `;

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: data.USER_EMAIL,
          subject: "🎟️ Your GoBus Ticket Confirmation",
          html: emailHtml,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log("✅ Ticket email sent to:", data.USER_EMAIL);
        } catch (mailErr) {
          console.error("❌ Error sending email:", mailErr);
        }

        res.status(201).json({
          success: true,
          message: "Payment added, booking updated, and email sent",
        });
      });
    }
  );
});

module.exports = router;
