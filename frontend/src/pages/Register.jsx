import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(`${backendUrl}/api/auth/register`, form);
      setSuccess('Registration successful! Please login.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-blue-400 to-purple-400">
      <div className="bg-white/30 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-96 flex flex-col items-center animate-fade-in">
        <div className="bg-green-500 rounded-full p-4 mb-4 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75M4.5 10.5h15m-1.5 0v7.125A2.625 2.625 0 0115.375 20.25h-6.75A2.625 2.625 0 016 17.625V10.5" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-green-900">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full p-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400" required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400" required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full p-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400" required />
          <select name="role" value={form.role} onChange={handleChange} className="w-full p-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400">
            <option value="user">User</option>
            <option value="provider">Provider</option>
          </select>
          {error && <div className="text-red-500 text-center">{error}</div>}
          {success && <div className="text-green-500 text-center">{success}</div>}
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold shadow-lg transition-all duration-300">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register; 