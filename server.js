const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");

// Import all routes
const authRoutes = require("./routes/authRoutes");
const busRoutes = require("./routes/busRoutes");
const tripRoutes = require("./routes/tripRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();

app.use(cors({
  origin: "https://bus-frontend-eight.vercel.app",
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));
app.use(express.json());

// ======= REQUEST LOGGER =======
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// ======= ROUTES =======
app.use("/api/auth", authRoutes);
app.use("/api/bus", busRoutes);
app.use("/api/trip", tripRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/contact", require("./routes/contact"));


// ======= TEST ROUTES =======
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "API test working ✅" });
});

// ======= START SERVER =======
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("======================================");
  console.log(`✔ Server running on PORT: ${PORT}`);
  console.log("✅ Connected to MySQL Database:", process.env.DB_NAME);
  console.log("======================================");
});

