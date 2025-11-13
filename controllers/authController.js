const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// ✅ REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    // ✅ Check if user already exists
    const [existing] = await db
      .promise()
      .query("SELECT * FROM USERS WHERE EMAIL = ?", [email]);

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists!" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert user
    await db
      .promise()
      .query(
        "INSERT INTO USERS (NAME, EMAIL, PASSWORD_HASH, ROLE) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, "USER"]
      );

    res.status(201).json({
      success: true,
      message: "User registered successfully ✅",
    });
  } catch (err) {
    console.error("❌ Register Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ✅ LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required!" });
    }

    // ✅ Find user
    const [rows] = await db
      .promise()
      .query("SELECT * FROM USERS WHERE EMAIL = ?", [email]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    const user = rows[0];

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.PASSWORD_HASH);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password!" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user.ID, email: user.EMAIL, role: user.ROLE },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful ✅",
      token,
      user: {
        id: user.ID,
        name: user.NAME,
        email: user.EMAIL,
        role: user.ROLE,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ✅ PROFILE (Protected)
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db
      .promise()
      .query(
        "SELECT ID, NAME, EMAIL, ROLE, CREATED_AT FROM USERS WHERE ID = ?",
        [userId]
      );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    res.status(200).json({ success: true, user: rows[0] });
  } catch (err) {
    console.error("❌ Profile Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = { registerUser, loginUser, getProfile };
