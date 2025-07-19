import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'Plumber', icon: <span role="img" aria-label="Plumber">🔧</span> },
  { name: 'Electrician', icon: <span role="img" aria-label="Electrician">💡</span> },
  { name: 'Carpenter', icon: <span role="img" aria-label="Carpenter">🪚</span> },
  { name: 'Cleaner', icon: <span role="img" aria-label="Cleaner">🧹</span> },
  { name: 'Painter', icon: <span role="img" aria-label="Painter">🎨</span> },
];

function Services() {
  const [selected, setSelected] = useState('');
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchProviders = async (category) => {
    setSelected(category);
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/providers?category=${category}`);
      setProviders(res.data);
    } catch {
      setProviders([]);
    }
    setLoading(false);
  };

  const handleViewProfile = (worker) => {
    if (worker.isVirtual) {
      // Save all virtual workers to localStorage for refresh support
      const allVirtual = {};
      providers.forEach(w => {
        if (w.isVirtual) allVirtual[w._id] = w;
      });
      localStorage.setItem('virtualWorkers', JSON.stringify(allVirtual));
      navigate(`/provider/${worker._id}`, { state: { worker } });
    } else {
      navigate(`/provider/${worker._id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 drop-shadow-lg">Browse Services</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => fetchProviders(cat.name)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full shadow-lg text-lg font-semibold transition-all duration-300 border-2 ${selected === cat.name ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 text-white border-transparent scale-105' : 'bg-white/80 text-blue-700 border-blue-200 hover:bg-blue-100'}`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
        {loading && <div className="text-center text-lg text-blue-600">Loading providers...</div>}
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
                  <button onClick={() => handleViewProfile(p)} className="px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 text-white rounded-full shadow hover:scale-105 transition-all">View Profile</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {selected && !loading && providers.length === 0 && <div className="text-center text-lg text-gray-500">No providers found for {selected}.</div>}
      </div>
    </div>
  );
}

export default Services; 