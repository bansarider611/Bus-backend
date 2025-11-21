const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "bansarider611@gmail.com",
      subject: "New Contact Form Message",
      html: `
        <h3>New Message from Contact Form</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.log("Email error:", err);
    return res.json({ success: false, message: "Failed to send message" });
  }
});

module.exports = router;
