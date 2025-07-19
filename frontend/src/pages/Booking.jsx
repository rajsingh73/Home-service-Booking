import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Booking() {
  const { providerId } = useParams();
  const [profile, setProfile] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/providers/${providerId}`);
        setProfile(res.data);
      } catch {}
    };
    fetchProfile();
  }, [providerId]);

  const handleBook = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${backendUrl}/api/bookings`, {
        providerId,
        serviceType: profile.servicesOffered[0],
        date,
        time,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Booking successful!');
      setTimeout(() => navigate('/user/dashboard'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed');
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="min-h-screen p-8">
      <h2 className="text-2xl font-bold mb-4">Book {profile.userId?.name}</h2>
      <form onSubmit={handleBook} className="space-y-4 w-80">
        <select value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded" required>
          <option value="">Select Date</option>
          {profile.availability?.map(a => (
            <option key={a.date} value={a.date}>{a.date}</option>
          ))}
        </select>
        <select value={time} onChange={e => setTime(e.target.value)} className="w-full p-2 border rounded" required>
          <option value="">Select Time</option>
          {profile.availability?.find(a => a.date === date)?.slots.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {message && <div className="text-green-500">{message}</div>}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Book</button>
      </form>
    </div>
  );
}

export default Booking; 