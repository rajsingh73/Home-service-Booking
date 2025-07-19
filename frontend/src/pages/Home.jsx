import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/30 via-transparent to-transparent pointer-events-none" />
      <div className="z-10 flex flex-col items-center justify-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg animate-fade-in">🏡 HomeEase</h1>
        <p className="mb-8 text-xl md:text-2xl font-medium animate-fade-in-slow">Book trusted home services easily!</p>
        <div className="space-x-4 flex animate-fade-in-slow">
          <Link to="/login" className="px-6 py-3 bg-white/90 text-blue-600 font-bold rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300 text-lg">Login</Link>
          <Link to="/register" className="px-6 py-3 bg-white/90 text-green-600 font-bold rounded-full shadow-lg hover:bg-green-600 hover:text-white transition-all duration-300 text-lg">Register</Link>
          <Link to="/services" className="px-6 py-3 bg-white/90 text-purple-600 font-bold rounded-full shadow-lg hover:bg-purple-600 hover:text-white transition-all duration-300 text-lg">View Services</Link>
        </div>
      </div>
    </div>
  );
}

export default Home; 