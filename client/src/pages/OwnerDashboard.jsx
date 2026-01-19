import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/stores/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardData(res.data);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!dashboardData) return <div className="p-8">No Store Found. Please contact Admin to link your account.</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Owner Dashboard: {dashboardData.storeName}</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>

      {/* Stats Card */}
      <div className="bg-white p-6 rounded shadow mb-8 w-64 border-l-4 border-blue-500">
        <h3 className="text-gray-500 uppercase text-sm">Average Rating</h3>
        <p className="text-4xl font-bold">{dashboardData.averageRating?.toFixed(1) || '0.0'} <span className="text-yellow-400">★</span></p>
      </div>

      {/* Users List Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        <div className="p-4 bg-gray-100 border-b font-bold">Recent Customer Ratings</div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-4">Customer Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Rating Given</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.ratings.map((rating) => (
              <tr key={rating.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{rating.User?.name || 'Unknown User'}</td>
                <td className="p-4">{rating.User?.email || 'N/A'}</td>
                <td className="p-4 font-bold text-yellow-600">{rating.rating} ★</td>
              </tr>
            ))}
          </tbody>
        </table>
        {dashboardData.ratings.length === 0 && <div className="p-4 text-center text-gray-500">No ratings yet.</div>}
      </div>
    </div>
  );
};

export default OwnerDashboard;