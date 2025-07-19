import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import ProviderProfile from './pages/ProviderProfile';
import Booking from './pages/Booking';
import UserDashboard from './pages/UserDashboard';
import ProviderDashboard from './pages/ProviderDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<Services />} />
        <Route path="/provider/:id" element={<ProviderProfile />} />
        <Route path="/booking/:providerId" element={<Booking />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
