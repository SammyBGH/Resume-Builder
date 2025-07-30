// src/App.jsx
import Header from './components/Header';
import React, { useEffect, useState } from 'react';
import Hero from './components/Hero';
import Steps from './components/Steps';
import Testimonials from './components/Testimonials';
import Builder from './components/Builder';
import Footer from './components/Footer';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);

  // ✅ Auto-login if token is saved
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios.get("http://localhost:5000/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setUser(res.data.user))
        .catch(() => localStorage.removeItem("authToken"));
    }
  }, []);

  // ✅ Handle Google login success
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/auth/google", {
        token: credentialResponse.credential,
      });
      localStorage.setItem("authToken", res.data.token);
      setUser(res.data.user);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="app-container">
        <Header />

        {/* ✅ Show login or welcome message */}
        <div style={{ textAlign: 'center', margin: '20px' }}>
          {user ? (
            <div>
              <p>Welcome, {user.name} 👋</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => console.log("Google Login Failed")}
            />
          )}
        </div>

        <Hero />
        <Steps />
        <Testimonials />
        <Builder />
        <Footer />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
