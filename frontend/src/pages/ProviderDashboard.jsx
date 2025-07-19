import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProviderDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ servicesOffered: [], description: '', availability: [] });
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ servicesOffered: '', description: '' });
  const [availability, setAvailability] = useState([{ date: '', slots: '' }]);
  const [message, setMessage] = useState('');

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchProfile();
    fetchBookings();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${backendUrl}/api/providers/${user._id}`);
      setProfile(res.data);
      setForm({
        servicesOffered: res.data.servicesOffered?.join(', ') || '',
        description: res.data.description || '',
      });
      setAvailability(res.data.availability?.map(a => ({ date: a.date, slots: a.slots.join(', ') })) || [{ date: '', slots: '' }]);
    } catch {}
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${backendUrl}/api/bookings/provider`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch {}
  };

  const handleProfileChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAvailabilityChange = (i, field, value) => {
    const newAvail = [...availability];
    newAvail[i][field] = value;
    setAvailability(newAvail);
  };
  const addAvailability = () => setAvailability([...availability, { date: '', slots: '' }]);

  const handleProfileSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${backendUrl}/api/providers/profile`, {
        servicesOffered: form.servicesOffered.split(',').map(s => s.trim()),
        description: form.description,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Profile updated!');
      fetchProfile();
    } catch (err) {
      setMessage('Update failed');
    }
  };

  const handleAvailabilitySubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${backendUrl}/api/providers/availability`, {
        availability: availability.map(a => ({ date: a.date, slots: a.slots.split(',').map(s => s.trim()) })),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Availability updated!');
      fetchProfile();
    } catch (err) {
      setMessage('Update failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white/70 backdrop-blur-lg shadow-xl p-6 flex flex-col items-center rounded-r-3xl animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-green-200 flex items-center justify-center text-4xl font-bold mb-4 shadow-lg">
          {user.name[0]}
        </div>
        <div className="text-xl font-semibold mb-1 text-green-900">{user.name}</div>
        <div className="text-gray-500 mb-6">{user.email}</div>
        <button
          className={`w-full py-2 mb-2 rounded-full font-semibold text-lg transition-all duration-300 ${activeTab === 'profile' ? 'bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-white shadow-lg scale-105' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="mr-2">👤</span> Profile
        </button>
        <button
          className={`w-full py-2 mb-2 rounded-full font-semibold text-lg transition-all duration-300 ${activeTab === 'availability' ? 'bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-white shadow-lg scale-105' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
          onClick={() => setActiveTab('availability')}
        >
          <span className="mr-2">📅</span> Availability
        </button>
        <button
          className={`w-full py-2 mb-2 rounded-full font-semibold text-lg transition-all duration-300 ${activeTab === 'bookings' ? 'bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-white shadow-lg scale-105' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
          onClick={() => setActiveTab('bookings')}
        >
          <span className="mr-2">📦</span> Bookings
        </button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl animate-fade-in">
            <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-purple-500 drop-shadow-lg text-center">Profile</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <label className="block mb-1 font-semibold text-green-900">Services Offered</label>
                <input name="servicesOffered" placeholder="Services (comma separated)" value={form.servicesOffered} onChange={handleProfileChange} className="w-full p-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-green-900">Description</label>
                <input name="description" placeholder="Description" value={form.description} onChange={handleProfileChange} className="w-full p-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <button type="submit" className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-all">Update Profile</button>
              {message && <div className="text-green-600 mt-2 text-center">{message}</div>}
            </form>
          </div>
        )}
        {activeTab === 'availability' && (
          <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl animate-fade-in">
            <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-purple-500 drop-shadow-lg text-center">Set Availability</h2>
            <form onSubmit={handleAvailabilitySubmit} className="space-y-6">
              {availability.map((a, i) => (
                <div key={i} className="flex space-x-2 mb-2">
                  <input type="date" value={a.date} onChange={e => handleAvailabilityChange(i, 'date', e.target.value)} className="p-3 border rounded-lg flex-1 border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400" />
                  <input type="text" placeholder="Slots (comma separated)" value={a.slots} onChange={e => handleAvailabilityChange(i, 'slots', e.target.value)} className="p-3 border rounded-lg flex-1 border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
              ))}
              <div className="flex space-x-2">
                <button type="button" onClick={addAvailability} className="bg-blue-400 text-white px-4 py-2 rounded-full font-bold shadow hover:scale-105 transition-all">Add Date</button>
                <button type="submit" className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition-all">Update Availability</button>
              </div>
              {message && <div className="text-green-600 mt-2 text-center">{message}</div>}
            </form>
          </div>
        )}
        {activeTab === 'bookings' && (
          <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl animate-fade-in">
            <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-purple-500 drop-shadow-lg text-center">Upcoming Bookings</h2>
            <ul className="space-y-6">
              {bookings.map(b => (
                <li key={b._id} className="p-6 bg-white/90 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-bold text-green-900 text-lg mb-1">User: {b.userId?.name}</div>
                    <div className="text-gray-700 mb-1">Service: {b.serviceType}</div>
                    <div className="text-gray-700 mb-1">Date: {b.date} <span className="ml-2">Time: {b.time}</span></div>
                    <div className="mb-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${b.status === 'booked' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>{b.status}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {bookings.length === 0 && <div className="text-center text-lg text-gray-500">No bookings yet.</div>}
          </div>
        )}
      </main>
    </div>
  );
}

export default ProviderDashboard; 