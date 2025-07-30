// server/routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🗄️ Fake DB (replace with MongoDB or real DB)
const users = [];

// ✅ Google Authentication
router.post("/google", async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    let user = users.find(u => u.googleId === payload.sub);

    if (!user) {
      user = {
        id: users.length + 1,
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        formData: {} // store resume form progress
      };
      users.push(user);
    }

    const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token: jwtToken, user });
  } catch (err) {
    res.status(401).json({ message: "Invalid Google token" });
  }
});

// ✅ Fetch logged-in user
router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = users.find(u => u.id === decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
