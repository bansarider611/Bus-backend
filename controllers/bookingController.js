const nodemailer = require("nodemailer");
const db = require("../config/db");

// 📨 Send Ticket Email
exports.sendTicket = async (req, res) => {
  try {
    const bookingId = req.params.id;

    // 1️⃣ Get booking details from database
    const sql = `
      SELECT 
        b.ID AS BOOKING_ID,
        u.NAME AS USER_NAME,
        u.EMAIL AS USER_EMAIL,
        r.\`FROM\` AS SOURCE,
        r.\`TO\` AS DESTINATION,
        t.DEPARTURE_TS,
        t.ARRIVAL_TS,
        b.AMOUNT,
        b.STATUS
      FROM BOOKING b
      JOIN USERS u ON b.USER_ID = u.ID
      JOIN TRIPS t ON b.TRIP_ID = t.ID
      JOIN ROUTES r ON t.ROUTE_ID = r.ID
      WHERE b.ID = ?
    `;

    // Use promise version of MySQL query
    const [result] = await db.promise().query(sql, [bookingId]);

    if (!result.length)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    const booking = result[0];

    // 2️⃣ Create a Nodemailer transporter (Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3️⃣ Define email content
    const mailOptions = {
      from: `"Bus Booking System" <${process.env.EMAIL_USER}>`,
      to: booking.USER_EMAIL,
      subject: `🎫 Your Bus Ticket (Booking ID: ${booking.BOOKING_ID})`,
      html: `
        <h2>Hello ${booking.USER_NAME},</h2>
        <p>Thank you for booking your bus trip with <strong>Bus Booking System</strong>.</p>
        <h3>Trip Details:</h3>
        <ul>
          <li><strong>From:</strong> ${booking.SOURCE}</li>
          <li><strong>To:</strong> ${booking.DESTINATION}</li>
          <li><strong>Departure:</strong> ${new Date(booking.DEPARTURE_TS).toLocaleString()}</li>
          <li><strong>Arrival:</strong> ${new Date(booking.ARRIVAL_TS).toLocaleString()}</li>
          <li><strong>Amount:</strong> ₹${booking.AMOUNT}</li>
          <li><strong>Status:</strong> ${booking.STATUS}</li>
        </ul>
        <p>We wish you a safe and happy journey! 🚍</p>
      `,
    };

    // 4️⃣ Send the email
    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: `Ticket sent successfully to ${booking.USER_EMAIL}`,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send ticket email",
      error: error.message,
    });
  }
};
