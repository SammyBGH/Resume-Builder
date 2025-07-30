import Header from './components/Header';
import React from 'react';
import Hero from './components/Hero';
import Steps from './components/Steps';
import Testimonials from './components/Testimonials';
import Builder from './components/Builder';
import './styles/App.css';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app-container">
      <Header />  {/* ✅ New header */}
      
      {/* ✅ Hero Section */}
      <Hero />

      {/* ✅ Steps Section */}
      <Steps />

      {/* ✅ Testimonials Section */}
      <Testimonials />

      {/* ✅ Builder Section */}
      <Builder />

     <Footer /> {/* ✅ Add Footer here */}
    </div>
  );
}

export default App;
