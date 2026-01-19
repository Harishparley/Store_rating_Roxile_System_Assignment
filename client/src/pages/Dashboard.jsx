import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/stores', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStores(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleRate = async (storeId, ratingValue) => {
    try {
      await axios.post('http://localhost:5000/api/stores/rate', 
        { storeId, rating: ratingValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh the list to show the new average rating immediately
      fetchStores();
      alert("Rating submitted!");
    } catch (err) {
      alert(err.response?.data?.error || "Error submitting rating");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
            <p className="text-gray-500 text-sm">Role: <span className="font-semibold uppercase text-blue-600">{user?.role}</span></p>
          </div>
          
          <div className="flex gap-3">
            {user?.role === 'admin' && (
              <button 
                onClick={() => navigate('/add-store')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition shadow"
              >
                + Add Store
              </button>
            )}
            <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition shadow">
              Logout
            </button>
          </div>
        </div>

        {/* Store Grid */}
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Available Stores</h2>
        
        {loading ? (
          <p>Loading stores...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div key={store.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{store.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{store.address}</p>
                
                {/* Current Rating Display */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="font-bold ml-1 text-gray-700">{store.rating ? store.rating.toFixed(1) : '0.0'}</span>
                  </div>
                  <span className="text-xs text-gray-400">Average Rating</span>
                </div>

                {/* Rating Buttons (Only for Users) */}
                {user?.role === 'user' && (
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">Rate this store:</p>
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRate(store.id, star)}
                          className="text-2xl text-gray-300 hover:text-yellow-400 focus:outline-none transition"
                          title={`Rate ${star} stars`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;