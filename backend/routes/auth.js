const express = require("express");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User"); // ✅ New MongoDB model
const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * ✅ Google Authentication
 * Endpoint: POST /auth/google
 */
router.post("/google", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "No Google token provided" });
  }

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // ✅ Check if user exists in DB
    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
      // ✅ New user registration
      user = new User({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture || "",
      });
      await user.save();
    } else {
      // ✅ Update profile info if changed
      user.name = payload.name;
      user.picture = payload.picture || user.picture;
      await user.save();
    }

    // ✅ Create JWT for session
    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture || "",
      },
    });
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(401).json({ message: "Invalid Google token" });
  }
});

/**
 * ✅ Get logged-in user info
 * Endpoint: GET /auth/me
 */
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture || "",
      },
    });
  } catch (err) {
    console.error("JWT Verification Error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;
