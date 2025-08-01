const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('./middlewares/passport');
const summarizeRoute = require('./routes/summarize');
const authRoute = require('./routes/auth');
const resumeRoutes = require('./routes/resumeRoutes'); // ✅ Import Resume routes
const path = require('path');

dotenv.config();

const app = express();

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// ✅ Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.JWT_SECRET || 'secret123',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // ✅ Change to true in production with HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use('/api/summarize', summarizeRoute);
app.use('/auth', authRoute);
app.use('/api/resumes', resumeRoutes); // ✅ Added Resume API route

// ✅ Default route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// ✅ Error handling
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: 'Server error' });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
