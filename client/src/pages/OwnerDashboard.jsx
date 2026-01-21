import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/stores/my-store', {
           headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  if (!data) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{data.store.name}</h1>
            <p className="text-gray-500">{data.store.address}</p>
          </div>
          <button onClick={handleLogout} className="px-6 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-50 transition">Logout</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
           <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-indigo-500 text-center">
              <p className="text-gray-400 uppercase tracking-widest text-xs mb-2">Average Rating</p>
              <div className="text-6xl font-extrabold text-indigo-600">{data.store.rating ? data.store.rating.toFixed(1) : '0.0'}</div>
              <div className="text-yellow-400 text-2xl mt-2">★★★★★</div>
           </div>
           <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-purple-500 flex flex-col justify-center items-center">
              <p className="text-gray-400 uppercase tracking-widest text-xs mb-2">Total Reviews</p>
              <p className="text-5xl font-bold text-gray-800">{data.users.length}</p>
           </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
           <div className="p-6 border-b border-gray-100 bg-gray-50">
             <h2 className="text-lg font-bold text-gray-700">Recent Customers</h2>
           </div>
           {data.users.length === 0 ? <p className="p-8 text-center text-gray-400">No ratings yet.</p> : (
             <ul className="divide-y divide-gray-100">
               {data.users.map((u, i) => (
                 <li key={i} className="p-5 flex justify-between hover:bg-gray-50">
                   <span className="font-medium text-gray-800">{u.name}</span>
                   <span className="text-gray-500 text-sm">{u.email}</span>
                 </li>
               ))}
             </ul>
           )}
        </div>
      </div>
    </div>
  );
};
export default OwnerDashboard;