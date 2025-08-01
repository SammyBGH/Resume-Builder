const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('./middlewares/passport');
const summarizeRoute = require('./routes/summarize');
const authRoute = require('./routes/auth');
const resumeRoutes = require('./routes/resumeRoutes');
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

// ✅ Allowed Origins
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL || 'https://resumio-five.vercel.app',
  'https://resumio-api.onrender.com'
];

// ✅ Middlewares
app.use(cors({
  origin: function (origin, callback) {
    // Allow server-to-server or same-origin requests
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS blocked: ${origin}`);
      callback(new Error('CORS not allowed for this origin'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.JWT_SECRET || 'secret123',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// ✅ API Routes
app.use('/api/summarize', summarizeRoute);
app.use('/auth', authRoute);
app.use('/api/resumes', resumeRoutes);

// ✅ Serve Frontend in Production (for Render Deployment)
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
  });
}

// ✅ Default API health check
app.get('/', (req, res) => {
  res.send('✅ Backend server is running...');
});

// ✅ Error handling
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ message: err.message || 'Server error' });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
