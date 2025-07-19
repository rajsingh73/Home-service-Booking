import React, { useEffect, useState } from 'react';
import axios from 'axios';

const categories = [
  { name: 'Plumber', icon: <span role="img" aria-label="Plumber">🔧</span> },
  { name: 'Electrician', icon: <span role="img" aria-label="Electrician">💡</span> },
  { name: 'Carpenter', icon: <span role="img" aria-label="Carpenter">🪚</span> },
  { name: 'Cleaner', icon: <span role="img" aria-label="Cleaner">🧹</span> },
  { name: 'Painter', icon: <span role="img" aria-label="Painter">🎨</span> },
];

function UserDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('services');
  const [bookings, setBookings] = useState([]);
  const [review, setReview] = useState({});
  const [message, setMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [providers, setProviders] = useState([]);
  const [bookingModal, setBookingModal] = useState({ open: false, provider: null, availability: [] });
  const [bookingForm, setBookingForm] = useState({ date: '', time: '' });

  useEffect(() => {
    if (activeTab === 'bookings') fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/bookings/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch {}
  };

  const handleReviewChange = (providerId, field, value) => {
    setReview({ ...review, [providerId]: { ...review[providerId], [field]: value } });
  };

  const handleReviewSubmit = async (providerId, bookingId) => {
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/reviews', {
        providerId,
        rating: review[providerId]?.rating,
        comment: review[providerId]?.comment,
        bookingId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Review submitted!');
      fetchBookings();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Review failed');
    }
  };

  const fetchProviders = async (category) => {
    setSelectedCategory(category);
    try {
      const res = await axios.get(`/api/providers?category=${category}`);
      setProviders(res.data);
    } catch {
      setProviders([]);
    }
  };

  const openBookingModal = async (provider) => {
    // Fetch provider profile to get up-to-date availability
    try {
      const res = await axios.get(`/api/providers/${provider._id}`);
      setBookingModal({ open: true, provider, availability: res.data.availability });
      setBookingForm({ date: '', time: '' });
    } catch {
      setBookingModal({ open: true, provider, availability: [] });
      setBookingForm({ date: '', time: '' });
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/bookings', {
        providerId: bookingModal.provider._id,
        serviceType: selectedCategory,
        date: bookingForm.date,
        time: bookingForm.time,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Booking successful!');
      setBookingModal({ open: false, provider: null, availability: [] });
      setActiveTab('bookings');
      fetchBookings();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Booking cancelled!');
      fetchBookings();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Cancel failed');
    }
  };

  // Get available dates and times for modal
  const availableDates = bookingModal.availability.filter(a => a.slots.length > 0).map(a => a.date);
  const availableTimes = bookingModal.availability.find(a => a.date === bookingForm.date)?.slots || [];

  // Only show bookings with status 'booked'
  const visibleBookings = bookings.filter(b => b.status === 'booked');
  // Show completed bookings for history
  const completedBookings = bookings.filter(b => b.status === 'completed');

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white/70 backdrop-blur-lg shadow-xl p-6 flex flex-col items-center rounded-r-3xl animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-4xl font-bold mb-4 shadow-lg">
          {user.name[0]}
        </div>
        <div className="text-xl font-semibold mb-1 text-blue-900">{user.name}</div>
        <div className="text-gray-500 mb-6">{user.email}</div>
        <button
          className={`w-full py-2 mb-2 rounded-full font-semibold text-lg transition-all duration-300 ${activeTab === 'services' ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 text-white shadow-lg scale-105' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
          onClick={() => setActiveTab('services')}
        >
          <span className="mr-2">🛠️</span> Browse Services
        </button>
        <button
          className={`w-full py-2 mb-2 rounded-full font-semibold text-lg transition-all duration-300 ${activeTab === 'bookings' ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 text-white shadow-lg scale-105' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
          onClick={() => setActiveTab('bookings')}
        >
          <span className="mr-2">📅</span> My Bookings
        </button>
        <button
          className={`w-full py-2 mb-2 rounded-full font-semibold text-lg transition-all duration-300 ${activeTab === 'history' ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 text-white shadow-lg scale-105' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
          onClick={() => setActiveTab('history')}
        >
          <span className="mr-2">📜</span> Booking History
        </button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeTab === 'services' && (
          <div>
            <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 drop-shadow-lg text-center">Browse Services</h2>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {categories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => fetchProviders(cat.name)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full shadow-lg text-lg font-semibold transition-all duration-300 border-2 ${selectedCategory === cat.name ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 text-white border-transparent scale-105' : 'bg-white/80 text-blue-700 border-blue-200 hover:bg-blue-100'}`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
            {providers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {providers.map(p => (
                  <div key={p._id} className="bg-white/80 rounded-2xl shadow-xl p-6 flex items-center space-x-6 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                    <img src={p.photo} alt={p.name} className="w-20 h-20 rounded-full object-cover border-4 border-blue-200 shadow-md" />
                    <div className="flex-1">
                      <div className="font-bold text-2xl text-blue-900 mb-1">{p.name}</div>
                      <div className="text-gray-600 mb-1">Age: {p.age}</div>
                      <div className="flex items-center mb-1">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="font-semibold text-blue-700">{p.rating} / 5</span>
                      </div>
                      <div className="text-gray-700 mb-2">{p.description}</div>
                      <button onClick={() => openBookingModal(p)} className="px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 text-white rounded-full shadow hover:scale-105 transition-all">Book Now</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 drop-shadow-lg text-center">My Bookings</h2>
            {visibleBookings.length === 0 && <div className="text-center text-lg text-gray-500">No bookings yet.</div>}
            <ul className="space-y-6">
              {visibleBookings.map(b => (
                <li key={b._id} className="p-6 bg-white/80 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-bold text-blue-900 text-lg mb-1">Provider: {b.providerId?.name}</div>
                    <div className="text-gray-700 mb-1">Service: {b.serviceType}</div>
                    <div className="text-gray-700 mb-1">Date: {b.date} <span className="ml-2">Time: {b.time}</span></div>
                    <div className="mb-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${b.status === 'booked' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>{b.status}</span>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0 flex flex-col md:flex-row md:items-center">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      placeholder="Rating (1-5)"
                      value={review[b.providerId?._id]?.rating || ''}
                      onChange={e => handleReviewChange(b.providerId?._id, 'rating', e.target.value)}
                      className="p-1 border rounded mr-2 mb-2 md:mb-0"
                    />
                    <input
                      type="text"
                      placeholder="Comment"
                      value={review[b.providerId?._id]?.comment || ''}
                      onChange={e => handleReviewChange(b.providerId?._id, 'comment', e.target.value)}
                      className="p-1 border rounded mr-2 mb-2 md:mb-0"
                    />
                    <button
                      onClick={() => handleReviewSubmit(b.providerId?._id, b._id)}
                      className="bg-green-500 text-white px-2 py-1 rounded mb-2 md:mb-0 md:mr-2 shadow hover:bg-green-600 transition-all"
                    >
                      Submit Review
                    </button>
                    <button
                      onClick={() => handleCancelBooking(b._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded shadow hover:bg-red-600 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {message && <div className="text-green-500 mt-4 text-center">{message}</div>}
          </div>
        )}
        {activeTab === 'history' && (
          <div>
            <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 drop-shadow-lg text-center">Booking History</h2>
            {completedBookings.length === 0 && <div className="text-center text-lg text-gray-500">No completed bookings yet.</div>}
            <ul className="space-y-6">
              {completedBookings.map(b => (
                <li key={b._id} className="p-6 bg-white/80 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between opacity-80">
                  <div>
                    <div className="font-bold text-blue-900 text-lg mb-1">Provider: {b.providerId?.name}</div>
                    <div className="text-gray-700 mb-1">Service: {b.serviceType}</div>
                    <div className="text-gray-700 mb-1">Date: {b.date} <span className="ml-2">Time: {b.time}</span></div>
                    <div className="mb-2">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-300 text-gray-700">Completed</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      {/* Booking Modal */}
      {bookingModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-96 animate-fade-in">
            <h3 className="text-2xl font-bold mb-4 text-blue-900">Book {bookingModal.provider.name}</h3>
            <form onSubmit={handleBook} className="space-y-4">
              <select
                value={bookingForm.date}
                onChange={e => setBookingForm({ ...bookingForm, date: e.target.value, time: '' })}
                className="w-full p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Date</option>
                {availableDates.map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
              <select
                value={bookingForm.time}
                onChange={e => setBookingForm({ ...bookingForm, time: e.target.value })}
                className="w-full p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                disabled={!bookingForm.date}
              >
                <option value="">Select Time</option>
                {availableTimes.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 text-white py-3 rounded-lg font-bold shadow-lg transition-all duration-300">Book</button>
              <button type="button" onClick={() => setBookingModal({ open: false, provider: null, availability: [] })} className="w-full bg-gray-300 text-black py-3 rounded-lg mt-2 font-bold shadow transition-all">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard; 