import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  console.log(`Helloo ${backendUrl}`);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${backendUrl}/api/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (res.data.user.role === 'provider') navigate('/provider/dashboard');
      else navigate('/user/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400">
      <div className="bg-white/30 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-96 flex flex-col items-center animate-fade-in">
        <div className="bg-blue-500 rounded-full p-4 mb-4 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75M4.5 10.5h15m-1.5 0v7.125A2.625 2.625 0 0115.375 20.25h-6.75A2.625 2.625 0 016 17.625V10.5" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-blue-900">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          <select name="role" value={form.role} onChange={handleChange} className="w-full p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="user">User</option>
            <option value="provider">Provider</option>
          </select>
          {error && <div className="text-red-500 text-center">{error}</div>}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold shadow-lg transition-all duration-300">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login; 