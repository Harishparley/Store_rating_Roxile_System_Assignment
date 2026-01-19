import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [stores, setStores] = useState([]);
  const [usersList, setUsersList] = useState([]); 
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [storeSearch, setStoreSearch] = useState('');
  const [storeSort, setStoreSort] = useState('rating_desc');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userEmailSearch, setUserEmailSearch] = useState('');

  // Add User Form State
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'user' });

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const isAdmin = user?.role === 'admin';
  const isOwner = user?.role === 'owner' || user?.role === 'store_owner';

  useEffect(() => {
    fetchStores();
    if (isAdmin) fetchAdminData();
  }, [storeSearch, storeSort, userRoleFilter, userEmailSearch]);

  const fetchStores = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/stores?search=${storeSearch}&sort=${storeSort}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStores(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchAdminData = async () => {
    try {
      const statsRes = await axios.get('http://localhost:5000/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } });
      setStats(statsRes.data);
      const usersRes = await axios.get(`http://localhost:5000/api/admin/users?role=${userRoleFilter}&email=${userEmailSearch}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsersList(usersRes.data);
    } catch (err) { console.error(err); }
  };

  const handleRate = async (storeId, ratingValue) => {
    try {
      await axios.post('http://localhost:5000/api/stores/rate', { storeId, rating: ratingValue }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Rating submitted!");
      fetchStores(); 
    } catch (err) { alert(err.response?.data?.error); }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/users', newUser, { headers: { Authorization: `Bearer ${token}` } });
      alert("User Created!");
      setNewUser({ name: '', email: '', password: '', address: '', role: 'user' }); 
      fetchAdminData(); 
    } catch (err) { alert(err.response?.data?.error); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      
      {/* --- MODERN NAVBAR --- */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                StoreRank
              </span>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right mr-4 hidden md:block">
                  <p className="text-sm font-bold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">{user?.role}</p>
               </div>
               
               {isOwner && <button onClick={() => navigate('/owner/dashboard')} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-medium hover:bg-purple-200 transition text-sm">My Dashboard</button>}
               {isAdmin && <button onClick={() => navigate('/add-store')} className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium hover:bg-green-200 transition text-sm">+ Add Store</button>}
               <button onClick={() => navigate('/change-password')} className="text-gray-600 hover:text-indigo-600 text-sm font-medium">Password</button>
               <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow transition text-sm font-bold">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* --- ADMIN STATS CARDS --- */}
        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 uppercase">Total Users</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.users}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full text-blue-600">👥</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 uppercase">Total Stores</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.stores}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full text-green-600">🏪</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-purple-500 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 uppercase">Total Ratings</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.ratings}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full text-purple-600">⭐</div>
              </div>
            </div>
          </div>
        )}

        {/* --- STORE FILTER BAR --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Explore Stores</h2>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
                <input 
                  type="text" 
                  placeholder="Search stores..." 
                  className="pl-4 pr-10 py-2 border rounded-lg w-full md:w-64 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={storeSearch} 
                  onChange={(e) => setStoreSearch(e.target.value)} 
                />
            </div>
            <select 
              className="border p-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={storeSort} 
              onChange={(e) => setStoreSort(e.target.value)}
            >
              <option value="rating_desc">Highest Rated</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
            </select>
          </div>
        </div>

        {/* --- STORES GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100">
              <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-4xl">🏪</span>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl text-gray-900 line-clamp-1">{store.name}</h3>
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                        <span className="text-yellow-500 text-sm mr-1">★</span>
                        <span className="font-bold text-gray-800">{store.rating ? store.rating.toFixed(1) : '0.0'}</span>
                    </div>
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{store.address}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Rate this store</p>
                  <div className="flex justify-between gap-1">
                    {[1,2,3,4,5].map(star => (
                      <button 
                        key={star} 
                        onClick={() => handleRate(store.id, star)} 
                        className="w-full py-2 rounded-md hover:bg-yellow-50 text-gray-300 hover:text-yellow-500 transition text-lg leading-none"
                        title={`Rate ${star} stars`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {stores.length === 0 && <div className="col-span-full text-center py-20 text-gray-400">No stores found matching your search.</div>}
        </div>

        {/* --- ADMIN USER MANAGEMENT SECTION --- */}
        {isAdmin && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800">User Management System</h2>
                <div className="flex gap-2 w-full md:w-auto">
                  <select className="border p-2 rounded-lg text-sm" value={userRoleFilter} onChange={(e) => setUserRoleFilter(e.target.value)}>
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="owner">Owner</option>
                  </select>
                  <input type="text" placeholder="Filter email..." className="border p-2 rounded-lg text-sm" value={userEmailSearch} onChange={(e) => setUserEmailSearch(e.target.value)} />
                </div>
             </div>

             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
                   <tr>
                     <th className="p-4 font-semibold">Name</th>
                     <th className="p-4 font-semibold">Email</th>
                     <th className="p-4 font-semibold">Role</th>
                     <th className="p-4 font-semibold">Address</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {usersList.map(u => (
                     <tr key={u.id} className="hover:bg-gray-50 transition">
                       <td className="p-4 font-medium text-gray-900">{u.name}</td>
                       <td className="p-4 text-gray-600">{u.email}</td>
                       <td className="p-4">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                           u.role === 'admin' ? 'bg-red-100 text-red-700' :
                           u.role === 'owner' ? 'bg-purple-100 text-purple-700' :
                           'bg-blue-100 text-blue-700'
                         }`}>
                           {u.role}
                         </span>
                       </td>
                       <td className="p-4 text-gray-500 text-sm truncate max-w-xs">{u.address}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>

             {/* CREATE USER FORM */}
             <div className="bg-gray-50 p-6 border-t border-gray-200">
               <h3 className="font-bold text-lg mb-4 text-gray-700">Add New User</h3>
               <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <input type="text" placeholder="Full Name" value={newUser.name} onChange={(e)=>setNewUser({...newUser, name:e.target.value})} className="border p-2 rounded-lg" required />
                  <input type="email" placeholder="Email Address" value={newUser.email} onChange={(e)=>setNewUser({...newUser, email:e.target.value})} className="border p-2 rounded-lg" required />
                  <input type="password" placeholder="Password" value={newUser.password} onChange={(e)=>setNewUser({...newUser, password:e.target.value})} className="border p-2 rounded-lg" required />
                  <input type="text" placeholder="Address (Optional)" value={newUser.address} onChange={(e)=>setNewUser({...newUser, address:e.target.value})} className="border p-2 rounded-lg" />
                  <div className="flex gap-2">
                    <select value={newUser.role} onChange={(e)=>setNewUser({...newUser, role:e.target.value})} className="border p-2 rounded-lg flex-grow">
                        <option value="user">User</option>
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition">+</button>
                  </div>
               </form>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;