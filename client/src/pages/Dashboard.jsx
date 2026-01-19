import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // --- STATE MANAGEMENT ---
  const [stores, setStores] = useState([]);
  const [usersList, setUsersList] = useState([]); 
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [loading, setLoading] = useState(true);

  // Store Filters (For Everyone)
  const [storeSearch, setStoreSearch] = useState('');
  const [storeSort, setStoreSort] = useState('rating_desc');

  // Admin User Filters (For Admins Only)
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userEmailSearch, setUserEmailSearch] = useState('');

  // Auth Data
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const isAdmin = user?.role === 'admin';
  const isOwner = user?.role === 'owner' || user?.role === 'store_owner';

  // --- FETCH DATA ---
  useEffect(() => {
    fetchStores();
    if (isAdmin) {
      fetchAdminData();
    }
  }, [storeSearch, storeSort, userRoleFilter, userEmailSearch]); // Re-fetch when filters change

  const fetchStores = async () => {
    try {
      // UPDATED: Now sends search & sort params to backend
      const res = await axios.get(`http://localhost:5000/api/stores?search=${storeSearch}&sort=${storeSort}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStores(res.data);
    } catch (err) {
      console.error("Error fetching stores", err);
    }
  };

  const fetchAdminData = async () => {
    try {
      const statsRes = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data);

      // UPDATED: Now sends role & email filters to backend
      const usersRes = await axios.get(`http://localhost:5000/api/admin/users?role=${userRoleFilter}&email=${userEmailSearch}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsersList(usersRes.data);
    } catch (err) {
      console.error("Error fetching admin data", err);
    }
  };

  const handleRate = async (storeId, ratingValue) => {
    try {
      await axios.post('http://localhost:5000/api/stores/rate', 
        { storeId, rating: ratingValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Rating submitted!");
      fetchStores(); 
    } catch (err) {
      alert(err.response?.data?.error || "Error");
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
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded shadow-sm">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
            <p className="text-gray-500 text-sm">Role: <span className="uppercase font-bold">{user?.role}</span></p>
          </div>
          <div className="flex gap-2">
            {isOwner && <button onClick={() => navigate('/owner/dashboard')} className="px-4 py-2 bg-purple-600 text-white rounded">My Store Dashboard</button>}
            {isAdmin && <button onClick={() => navigate('/add-store')} className="px-4 py-2 bg-green-600 text-white rounded">+ Add Store</button>}
            <button onClick={() => navigate('/change-password')} className="px-4 py-2 bg-blue-500 text-white rounded">Password</button>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
          </div>
        </div>

        {/* --- ADMIN SECTION: STATS --- */}
        {isAdmin && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded shadow text-center border-t-4 border-blue-500">
              <h3 className="text-gray-500">Total Users</h3>
              <p className="text-3xl font-bold">{stats.users}</p>
            </div>
            <div className="bg-white p-6 rounded shadow text-center border-t-4 border-green-500">
              <h3 className="text-gray-500">Total Stores</h3>
              <p className="text-3xl font-bold">{stats.stores}</p>
            </div>
            <div className="bg-white p-6 rounded shadow text-center border-t-4 border-purple-500">
              <h3 className="text-gray-500">Total Ratings</h3>
              <p className="text-3xl font-bold">{stats.ratings}</p>
            </div>
          </div>
        )}

        {/* --- SECTION 1: STORES LIST (Search & Sort Added) --- */}
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold">All Stores</h2>
          
          {/* Search & Sort Controls */}
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search store..." 
              className="border p-2 rounded w-64"
              value={storeSearch}
              onChange={(e) => setStoreSearch(e.target.value)}
            />
            <select 
              className="border p-2 rounded"
              value={storeSort}
              onChange={(e) => setStoreSort(e.target.value)}
            >
              <option value="rating_desc">Highest Rated</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stores.map((store) => (
            <div key={store.id} className="bg-white p-6 rounded shadow hover:shadow-lg transition">
              <h3 className="font-bold text-lg mb-1">{store.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{store.address}</p>
              
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="text-yellow-600 font-bold text-lg">★ {store.rating ? store.rating.toFixed(1) : '0.0'}</span>
                
                {/* Rating Buttons */}
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(star => (
                    <button 
                      key={star} 
                      onClick={() => handleRate(store.id, star)} 
                      className="text-gray-300 hover:text-yellow-500 focus:text-yellow-500 text-xl leading-none"
                      title={`Rate ${star} stars`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {stores.length === 0 && <p className="text-gray-500 col-span-3 text-center py-8">No stores found.</p>}
        </div>

        {/* --- SECTION 2: ADMIN USER MANAGEMENT (Filters Added) --- */}
        {isAdmin && (
          <div className="border-t pt-8">
             <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-bold">User Management</h2>
                
                {/* Admin Filters */}
                <div className="flex gap-2">
                  <select 
                    className="border p-2 rounded"
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                  >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="owner">Owner</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="Filter by email..." 
                    className="border p-2 rounded"
                    value={userEmailSearch}
                    onChange={(e) => setUserEmailSearch(e.target.value)}
                  />
                </div>
             </div>

             <div className="bg-white rounded shadow overflow-hidden">
               <table className="min-w-full">
                 <thead className="bg-gray-800 text-white">
                   <tr>
                     <th className="text-left p-4">Name</th>
                     <th className="text-left p-4">Email</th>
                     <th className="text-left p-4">Role</th>
                     <th className="text-left p-4">Address</th>
                   </tr>
                 </thead>
                 <tbody>
                   {usersList.map(u => (
                     <tr key={u.id} className="border-b hover:bg-gray-50">
                       <td className="p-4 font-medium">{u.name}</td>
                       <td className="p-4 text-gray-600">{u.email}</td>
                       <td className="p-4">
                         <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                           u.role === 'admin' ? 'bg-red-100 text-red-800' :
                           u.role === 'owner' ? 'bg-purple-100 text-purple-800' :
                           'bg-green-100 text-green-800'
                         }`}>
                           {u.role}
                         </span>
                       </td>
                       <td className="p-4 text-gray-500 text-sm truncate max-w-xs">{u.address}</td>
                     </tr>
                   ))}
                   {usersList.length === 0 && (
                     <tr><td colSpan="4" className="p-6 text-center text-gray-500">No users found matching filters.</td></tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;