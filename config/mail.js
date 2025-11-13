require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your gmail id
    pass: process.env.EMAIL_PASS, // your gmail app password
  },
  logger: true,  // show debug logs
  debug: true,   // enable smtp debug output
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail transporter error:", error);
  } else {
    console.log("✅ Mail transporter ready to send emails");
  }
});

module.exports = transporter;
