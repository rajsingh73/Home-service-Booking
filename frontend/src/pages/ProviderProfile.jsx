import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProviderProfile() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If virtual worker, get data from navigation state or localStorage
    if (id.startsWith('virtual-')) {
      let virtual = location.state?.worker;
      if (!virtual) {
        // Try to get from localStorage (in case of page refresh)
        const workers = JSON.parse(localStorage.getItem('virtualWorkers') || '{}');
        virtual = workers[id];
      }
      if (virtual) {
        setProfile(virtual);
      } else {
        setProfile(null);
      }
      setLoading(false);
      setReviews([]);
      return;
    }
    // Real provider: fetch from backend
    const fetchProfile = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const res = await axios.get(`${backendUrl}/api/providers/${id}`);
        setProfile(res.data);
      } catch {
        setProfile(null);
      }
    };
    const fetchReviews = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const res = await axios.get(`${backendUrl}/api/reviews/${id}`);
        setReviews(res.data);
      } catch {
        setReviews([]);
      }
    };
    fetchProfile();
    fetchReviews();
    setLoading(false);
  }, [id, location.state]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400 text-white">Loading...</div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400 text-white">Provider not found.</div>;

  // If virtual worker, show their info
  if (id.startsWith('virtual-')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400">
        <div className="bg-white/30 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-lg flex flex-col items-center animate-fade-in">
          <img src={profile.photo} alt={profile.name} className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-200 shadow-lg" />
          <h2 className="text-3xl font-bold mb-2 text-blue-900">{profile.name}</h2>
          <div className="mb-2 text-lg text-gray-700">Age: {profile.age}</div>
          <div className="mb-2 flex items-center text-lg">
            <span className="text-yellow-400 mr-1">★</span>
            <span className="font-semibold text-blue-700">{profile.rating} / 5</span>
          </div>
          <div className="mb-2 text-gray-800">{profile.description}</div>
          <span className="inline-block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">Virtual Worker</span>
          <button onClick={() => navigate(-1)} className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 text-white rounded-full shadow hover:scale-105 transition-all">Back</button>
        </div>
      </div>
    );
  }

  // Real provider
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400">
      <div className="bg-white/30 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-lg animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-full bg-blue-200 flex items-center justify-center text-5xl font-bold mb-4 shadow-lg">
            {profile.userId?.name ? profile.userId.name[0] : '👤'}
          </div>
          <h2 className="text-3xl font-bold mb-2 text-blue-900">{profile.userId?.name}</h2>
          <div className="mb-2 text-gray-800">{profile.description}</div>
        </div>
        <div className="mb-4">
          <span className="inline-block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 text-white px-4 py-1 rounded-full text-sm font-semibold mb-2">Services: {profile.servicesOffered?.join(', ')}</span>
        </div>
        <div className="mb-6">
          <span className="block font-semibold text-blue-900 mb-1">Availability:</span>
          <ul className="space-y-1">
            {profile.availability?.map((a, i) => (
              <li key={i} className="text-gray-700">{a.date}: <span className="text-blue-700 font-semibold">{a.slots.join(', ')}</span></li>
            ))}
          </ul>
        </div>
        <Link to={`/booking/${profile.userId?._id}`} className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 text-white rounded-full shadow hover:scale-105 transition-all">Book Now</Link>
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-2 text-blue-900">Reviews</h3>
          {reviews.length === 0 && <div className="text-gray-600">No reviews yet.</div>}
          <ul className="space-y-3">
            {reviews.map(r => (
              <li key={r._id} className="bg-white/70 rounded-xl p-4 shadow flex flex-col">
                <div className="font-bold text-blue-700 mb-1">{r.userId?.name}</div>
                <div className="flex items-center mb-1">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="font-semibold text-blue-700">{r.rating || 'N/A'} / 5</span>
                </div>
                <div className="text-gray-800">{r.comment}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProviderProfile; 