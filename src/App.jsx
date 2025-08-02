// src/App.jsx
import React, { useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';

import Header from './components/Header';
import Hero from './components/Hero';
import Steps from './components/Steps';
import Testimonials from './components/Testimonials';
import Builder from './components/Builder';
import Footer from './components/Footer';

import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);

  // ✅ Load user info if token exists
  const fetchUser = async (token) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (err) {
      localStorage.removeItem("authToken");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetchUser(token);
    }
  }, []);

  // ✅ Handle Google login
  const handleLoginSuccess = async (credentialResponse) => {
    if (!credentialResponse || !credentialResponse.credential) {
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/google`, {
        token: credentialResponse.credential,
      });

      localStorage.setItem("authToken", res.data.token);

      // Immediately fetch full user data (with image)
      fetchUser(res.data.token);
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
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
        <Header
          user={user}
          handleLoginSuccess={handleLoginSuccess}
          handleLogout={handleLogout}
        />

        {/* ✅ Main sections */}
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
